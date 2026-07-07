-- ========================================================================
-- Avaliações de livros (comentários + notas de 1 a 5 estrelas)
-- Execute este script no Supabase: SQL Editor -> New query -> Run
-- ========================================================================

create extension if not exists pgcrypto;

create table if not exists public.avaliacoes (
  id         uuid primary key default gen_random_uuid(),
  livro_id   text not null,                 -- 'laura' | 'vila' | 'lipe' | 'ararinha' | 'bela' ...
  nome       text not null,
  nota       smallint not null check (nota between 1 and 5),
  comentario text not null,
  aprovado   boolean not null default true, -- permite moderar avaliações no futuro
  criado_em  timestamptz not null default now(),
  constraint avaliacoes_nome_len check (char_length(nome) between 1 and 60),
  constraint avaliacoes_comentario_len check (char_length(comentario) between 1 and 600)
);

create index if not exists avaliacoes_livro_id_idx  on public.avaliacoes (livro_id);
create index if not exists avaliacoes_criado_em_idx on public.avaliacoes (criado_em desc);

-- Row Level Security: leitura pública das avaliações aprovadas,
-- e qualquer visitante pode enviar uma nova avaliação (sem precisar de login).
alter table public.avaliacoes enable row level security;

drop policy if exists "Avaliacoes aprovadas sao publicas" on public.avaliacoes;
create policy "Avaliacoes aprovadas sao publicas"
  on public.avaliacoes
  for select
  using (aprovado = true);

drop policy if exists "Qualquer pessoa pode enviar avaliacao" on public.avaliacoes;
create policy "Qualquer pessoa pode enviar avaliacao"
  on public.avaliacoes
  for insert
  with check (
    char_length(nome) between 1 and 60
    and char_length(comentario) between 1 and 600
    and nota between 1 and 5
  );

-- Nenhuma policy de update/delete: apenas via SQL Editor ou service_role (moderação manual).
