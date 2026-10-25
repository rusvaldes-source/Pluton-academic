// B101: authenticated checkout; requires STRIPE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY in Supabase secrets.
// Never expose these secrets in the browser.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
const origin = Deno.env.get("SITE_ORIGIN") || "https://www.plutonacademic.com";
const url = Deno.env.get("SUPABASE_URL")!;
const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  if (!stripeKey || !service || !anon) return respond({ error: "Checkout not configured" }, 503);
  const bearer = req.headers.get("Authorization") || "";
  if (!bearer.startsWith("Bearer ")) return respond({ error: "Sign in required" }, 401);
  const client = createClient(url, anon, { global: { headers: { Authorization: bearer } } });
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user?.email) return respond({ error: "Sign in required" }, 401);
  let code = "";
  try { code = String((await req.json()).course_code || "").trim().toUpperCase(); } catch { return respond({ error: "Invalid request" }, 400); }
  if (!/^[A-Z]{2,6}-[0-9]{3}$/.test(code)) return respond({ error: "Invalid course" }, 400);
  const admin = createClient(url, service);
  const { data: course, error: courseError } = await admin.from(["ELEC-101", "HVAC-101", "BEAUTY-101"].includes(code) ? "course_premium_content" : "course_editor_state").select("course_code").eq("course_code", code).maybeSingle();
  if (courseError || !course) return respond({ error: "Course not found" }, 404);
  const { data: access } = await admin.from("course_purchase_access").select("active").eq("user_id", user.id).eq("course_code", code).maybeSingle();
  if (access?.active) return respond({ already_owned: true });
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("client_reference_id", user.id);
  form.set("customer_email", user.email);
  form.set("line_items[0][price_data][currency]", "usd");
  form.set("line_items[0][price_data][unit_amount]", "999");
  form.set("line_items[0][price_data][product_data][name]", "PLUTÓN ACADEMIC · " + code);
  form.set("line_items[0][quantity]", "1");
  form.set("metadata[user_id]", user.id);
  form.set("metadata[course_code]", code);
  form.set("payment_intent_data[metadata][user_id]", user.id);
  form.set("payment_intent_data[metadata][course_code]", code);
  form.set("success_url", origin + "/dashboard.html?checkout=success&course=" + encodeURIComponent(code));
  form.set("cancel_url", origin + "/index.html?course=" + encodeURIComponent(code) + "#cursos");
  const stripe = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: "Bearer " + stripeKey, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
  const result = await stripe.json();
  if (!stripe.ok || !result.url) { console.error("Stripe checkout failed", stripe.status); return respond({ error: "Checkout unavailable" }, 502); }
  return respond({ url: result.url });
});
