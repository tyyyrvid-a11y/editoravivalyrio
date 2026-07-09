-- ========================================================================
-- Autenticação de clientes (Supabase Auth) + perfil + gate no checkout
-- Execute este script no Supabase: SQL Editor -> New query -> Run
-- ========================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------------
-- 1) Perfil do cliente, 1:1 com auth.users
-- ------------------------------------------------------------------------
create table if not exists public.clientes (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text not null default '',
  telefone      text not null default '',
  cep           text not null default '',
  rua           text not null default '',
  numero        text not null default '',
  complemento   text not null default '',
  bairro        text not null default '',
  cidade        text not null default '',
  uf            text not null default '',
  criado_em     timestamptz not null default now()
);

alter table public.clientes enable row level security;

drop policy if exists "Cliente le o proprio perfil" on public.clientes;
create policy "Cliente le o proprio perfil"
  on public.clientes for select
  using (auth.uid() = id);

drop policy if exists "Cliente atualiza o proprio perfil" on public.clientes;
create policy "Cliente atualiza o proprio perfil"
  on public.clientes for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- Sem policy de insert: a linha é criada pelo trigger abaixo (security definer).
-- Sem policy de delete: perfil só é removido via cascade quando o auth.users é removido.

-- ------------------------------------------------------------------------
-- 2) Trigger: ao criar usuário em auth.users, cria a linha em clientes
--    puxando os campos enviados em signUp({ options: { data: {...} } })
-- ------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.clientes (id, nome, telefone, cep, rua, numero, complemento, bairro, cidade, uf)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'telefone', ''),
    coalesce(new.raw_user_meta_data->>'cep', ''),
    coalesce(new.raw_user_meta_data->>'rua', ''),
    coalesce(new.raw_user_meta_data->>'numero', ''),
    coalesce(new.raw_user_meta_data->>'complemento', ''),
    coalesce(new.raw_user_meta_data->>'bairro', ''),
    coalesce(new.raw_user_meta_data->>'cidade', ''),
    coalesce(new.raw_user_meta_data->>'uf', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------
-- 3) pedidos: vincula ao usuário logado, sem quebrar a leitura do admin
-- ------------------------------------------------------------------------
alter table public.pedidos add column if not exists user_id uuid references auth.users(id);

alter table public.pedidos enable row level security;

-- admin.html lê pedidos com a chave anônima, sem sessão de usuário —
-- esta policy mantém a leitura pública para não quebrar o painel admin.
drop policy if exists "Leitura publica de pedidos (admin)" on public.pedidos;
create policy "Leitura publica de pedidos (admin)"
  on public.pedidos for select
  using (true);

drop policy if exists "Cliente logado cria seu proprio pedido" on public.pedidos;
create policy "Cliente logado cria seu proprio pedido"
  on public.pedidos for insert
  with check (auth.uid() = user_id);

-- Sem policy de update/delete: gerenciamento de status continua manual
-- (SQL Editor / service_role), igual ao padrão de avaliacoes.
