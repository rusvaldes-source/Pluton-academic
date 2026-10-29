-- Additive B115 support-only counters. No payment/course data or stored chat text.
create schema if not exists support_private;
revoke all on schema support_private from public,anon,authenticated;
grant usage on schema support_private to authenticated;
create table support_private.b115_budget(singleton boolean primary key default true check(singleton),used integer not null default 0 check(used between 0 and 400));
insert into support_private.b115_budget values(true,0);
create table support_private.b115_usage(user_id uuid primary key,day_start date not null,day_count integer not null,minute_start timestamptz not null,minute_count integer not null);
alter table support_private.b115_budget enable row level security;
alter table support_private.b115_usage enable row level security;
revoke all on all tables in schema support_private from public,anon,authenticated;
create function support_private.b115_reserve() returns boolean language plpgsql security definer set search_path='' as $$
declare who uuid:=auth.uid(); u support_private.b115_usage%rowtype; total integer; moment timestamptz:=clock_timestamp();
begin
 if who is null then raise exception 'Authentication required' using errcode='42501';end if;
 select used into total from support_private.b115_budget where singleton=true for update;
 if total is null or total>=400 then return false;end if;
 insert into support_private.b115_usage values(who,(moment at time zone 'UTC')::date,0,moment,0) on conflict do nothing;
 select * into u from support_private.b115_usage where user_id=who for update;
 if u.day_start<>(moment at time zone 'UTC')::date then u.day_start:=(moment at time zone 'UTC')::date;u.day_count:=0;end if;
 if moment>=u.minute_start+interval '1 minute' then u.minute_start:=moment;u.minute_count:=0;end if;
 if u.day_count>=20 or u.minute_count>=5 then return false;end if;
 update support_private.b115_usage set day_start=u.day_start,day_count=u.day_count+1,minute_start=u.minute_start,minute_count=u.minute_count+1 where user_id=who;
 update support_private.b115_budget set used=used+1 where singleton=true;
 return true;
end;$$;
revoke all on function support_private.b115_reserve() from public,anon,authenticated;
grant execute on function support_private.b115_reserve() to authenticated;
create function public.b115_reserve_support_ai() returns boolean language sql security invoker set search_path='' as $$select support_private.b115_reserve()$$;
revoke all on function public.b115_reserve_support_ai() from public,anon;
grant execute on function public.b115_reserve_support_ai() to authenticated;
-- The existing production support schema stores ticket text in support_messages.
create function public.b115_create_support_ticket(p_category text,p_subject text,p_description text) returns uuid language plpgsql security invoker set search_path='' as $$
declare who uuid:=auth.uid(); ticket uuid;
begin
 if who is null then raise exception 'Authentication required' using errcode='42501';end if;
 if p_category is null or p_category not in ('access','email','technical','billing','other') or p_subject is null or length(trim(p_subject)) not between 3 and 120 or p_description is null or length(trim(p_description)) not between 10 and 3000 then raise exception 'Invalid support request' using errcode='22023';end if;
 insert into public.support_tickets(user_id,subject,category,status) values(who,trim(p_subject),p_category,'open') returning id into ticket;
 insert into public.support_messages(ticket_id,sender_id,body) values(ticket,who,trim(p_description));
 return ticket;
end;$$;
revoke all on function public.b115_create_support_ticket(text,text,text) from public,anon;
grant execute on function public.b115_create_support_ticket(text,text,text) to authenticated;
