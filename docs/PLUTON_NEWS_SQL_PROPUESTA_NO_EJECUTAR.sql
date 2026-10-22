-- PLUTÓN NEWS — PROPUESTA, NO EJECUTADA. Revisar antes de aplicar a Supabase.
-- Lectura pública mínima: solo registros publicados. Mantiene privadas las filas en draft/review.
-- Requiere auditoría de grants/RLS antes de ejecutarse.
create or replace function public.pluton_news_public(limit_count integer default 20, offset_count integer default 0)
returns table (id uuid, title_es text, title_en text, body_es text, body_en text, published_at timestamptz, video_url text)
language sql stable security invoker
set search_path = ''
as $$
 select n.id,n.title_es,n.title_en,n.body_es,n.body_en,n.published_at,n.video_url
 from public.pluton_news n
 where n.status = 'published' and n.published_at is not null
 order by n.published_at desc,n.id desc
 limit least(greatest(coalesce(limit_count,20),1),50)
 offset greatest(coalesce(offset_count,0),0);
$$;
-- Importante: security invoker respeta RLS. Para acceso anónimo, se necesita
-- una política SELECT limitada a published y permisos EXECUTE/SELECT pertinentes.
-- No aplicar la política sin evaluar si expondría columnas privadas de la tabla.
-- Alternativa recomendada: endpoint server-side con credenciales solo en servidor,
-- respuesta con campos explícitamente permitidos y validación status='published'.
