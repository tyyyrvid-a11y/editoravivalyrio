-- ========================================================================
-- Status dos pedidos + permissão de atualização pelo painel Admin
-- Execute no Supabase: SQL Editor -> New query -> Run
-- ========================================================================

-- 1) Garante a coluna de status (Pendente / Preparando / Enviando / Enviado)
alter table public.pedidos
  add column if not exists status text not null default 'pendente';

-- 2) O admin.html atualiza o status usando a chave anônima (anon),
--    então precisamos de uma policy de UPDATE pública, no mesmo padrão
--    da leitura pública já usada pelo painel.
--    OBS: isso permite que qualquer um com a anon key altere o status.
--    O painel é protegido por senha no client. Para produção mais rígida,
--    troque por uma Edge Function com service_role.
alter table public.pedidos enable row level security;

drop policy if exists "Atualizacao publica de status (admin)" on public.pedidos;
create policy "Atualizacao publica de status (admin)"
  on public.pedidos for update
  using (true) with check (true);

-- 3) Permite que o painel Admin apague pedidos (botão "Apagar").
--    Mesmo padrão/segurança da policy de update acima.
drop policy if exists "Exclusao publica de pedidos (admin)" on public.pedidos;
create policy "Exclusao publica de pedidos (admin)"
  on public.pedidos for delete
  using (true);
