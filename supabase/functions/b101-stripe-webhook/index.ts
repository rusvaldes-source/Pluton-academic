// B101: only verified Stripe events can grant purchase access.
// Set STRIPE_WEBHOOK_SECRET to the endpoint signing secret; deploy with verify_jwt=false.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const encoder = new TextEncoder();
const hex = (bytes: Uint8Array) => Array.from(bytes).map(x => x.toString(16).padStart(2, "0")).join("");
async function signatureValid(raw: string, header: string): Promise<boolean> {
  const parts = header.split(",").map(s => s.trim().split("="));
  const t = parts.find(p => p[0] === "t")?.[1];
  const signatures = parts.filter(p => p[0] === "v1").map(p => p[1]);
  if (!t || !signatures.length || !/^\d+$/.test(t) || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = hex(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(t + "." + raw))));
  // Compare signatures in constant-time to avoid timing side channels.
  return signatures.some(sig => { if (!/^[a-f0-9]{64}$/.test(sig)) return false; let diff = 0; for (let i = 0; i < 64; i++) diff |= sig.charCodeAt(i) ^ signed.charCodeAt(i); return diff === 0; });
}
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!secret || !stripeKey) return new Response("Webhook not configured", { status: 503 });
  const raw = await req.text();
  if (!(await signatureValid(raw, req.headers.get("stripe-signature") || ""))) return new Response("Invalid signature", { status: 400 });
  const event = JSON.parse(raw);
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return new Response("ignored", { status: 200 });
  const sessionId = event.data?.object?.id;
  if (!/^cs_(test_|live_)/.test(sessionId || "")) return new Response("Invalid session", { status: 400 });
  // Retrieve the session directly from Stripe to confirm amount, currency, mode and paid status.
  const resp = await fetch("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId), { headers: { Authorization: "Bearer " + stripeKey } });
  if (!resp.ok) return new Response("Stripe verification failed", { status: 503 });
  const session = await resp.json();
  const code = session.metadata?.course_code;
  const userId = session.metadata?.user_id;
  if (session.mode !== "payment" || session.payment_status !== "paid" || session.amount_total !== 999 || session.currency !== "usd" || session.client_reference_id !== userId || !/^[a-f0-9-]{36}$/.test(userId || "") || !/^[A-Z]{2,5}-[0-9]{3}$/.test(code || "")) return new Response("Session validation failed", { status: 400 });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: course } = await admin.from("course_editor_state").select("course_code").eq("course_code", code).maybeSingle();
  if (!course) return new Response("Unknown course", { status: 400 });
  const { error } = await admin.from("course_purchase_access").upsert({ user_id: userId, course_code: code, active: true }, { onConflict: "user_id,course_code" });
  if (error) { console.error("Access grant failed", error.code); return new Response("Database unavailable", { status: 503 }); }
  return new Response("ok", { status: 200 });
});
