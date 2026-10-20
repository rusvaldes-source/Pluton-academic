-- B94: READ-ONLY verification of the deployed administration permissions.
-- Do not run the old B58 role bootstrap: the live role source is support_admins.
-- This file never replaces is_pluton_admin, creates a second role table or grants access.
select p.proname, p.prosecdef, p.proconfig, pg_get_functiondef(p.oid)
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='is_pluton_admin';
select tablename,policyname,roles,cmd,qual,with_check
from pg_policies where schemaname='public'
and tablename in ('support_admins','profiles','pluton_news','connect_reports');
select c.relname,c.relrowsecurity from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('support_admins','profiles','pluton_news','connect_reports');
