# Watchlist

> Frontend do website **Watchlist** — plataforma multimídia para salvar, organizar e consumir conteúdos (filmes, séries, animes, livros, mangás etc.).

> Este repositório contém apenas o frontend; o backend está em outro repositório (Node).



# Resumão

* [Visão geral](#visão-geral)
* [Principais features](#principais-features)
* [Fluxo de autenticação](#fluxo-de-autenticação)
* [Design / Styling / Acessibilidade](#design--styling--acessibilidade)
* [Testes e Qualidade](#testes-e-qualidade)
* [CI / CD & deploy](#ci--cd----deploy)
* [Contato e links úteis](#contato-e-links-úteis)


# Visão geral

Watchlist é um produto dividido em duas squads: **Frontend (UI)** e **Backend (Node)**. O frontend é responsável por toda a experiência do usuário: layout, interações, autenticação, chamadas à API, e visualização/edição de conteúdos, álbuns, comunidades e perfis.




# Principais features

Resumo das funcionalidades suportadas (frontend):

* Autenticação: login tradicional (email/senha) + login com Google (OAuth).
* Recuperação de senha (triggera backend que usa nodemailer + Resend — *nota: emails ainda dependem de domínio*).
* Cadastro com passo extra para escolher **username** único.
* Home com categorias fixas (Todos, Favoritos, Filmes, Séries, Animes, Livros, Mangás) e layout tipo Kanban horizontal: `Assistindo/Lendo`, `Quero ver/Ler`, `Finalizados`.
* Cards customizáveis (layouts vertical/horizontal).

A partir daqui, está em desenvolvimento:
* Álbum de conteúdos — CRUD de álbuns com visibilidade (Público / Não-listado / Privado), colaboradores, comentários, favoritar.
* Conteúdo detalhado: título obrigatório + metadados, anotações, visibilidade por conteúdo, compartilhamento, copy-to-library.
* Anotações com pin, reações (6 emojis), limite de visualização e histórico de anotações no perfil.
* Perfil do usuário com privacidade e versão pública com seguir/seguidores.
* Comunidade: feed com algoritmo “Seguindo / Explorar”, sliders para conteúdo, álbuns e comentários em destaque.
* Notificações e área de perfil interativas.
* Usuários anônimos (planejado; ainda não adicionado).



# Fluxo de autenticação

Resumo técnico (frontend ↔ backend):

1. **Login tradicional**

   * usuário envia email + senha -> `/auth/login` (backend)
   * backend valida, retorna **JWT** (access token) + refresh token (opcional)
   * frontend armazena token seguro (preferência: httpOnly cookie via backend; se usar localStorage, documentar riscos)
2. **Login com Google**

   * frontend inicia fluxo OAuth com `VITE_GOOGLE_CLIENT_ID` → backend valida token do Google e emite JWT
   * Google já fornece verificação de email; assim `isEmailVerified = true`
3. **"Esqueci a senha"**

   * frontend envia email para endpoint -> backend dispara email via nodemailer + Resend
   * *IMPORTANTE:* atualmente emails só funcionarão quando o domínio for configurado no serviço de envio
4. **Verificação de email**

   * No nosso fluxo decidimos **não bloquear o uso do app** na verificação inicial, mas `isEmailVerified` controla recursos (por exemplo criar álbuns públicos).
   * A verificação pode ser solicitada em tela de perfil/configurações.
5. **Roles e permissões**

   * usuário tem `roles` / campos booleanos (ex: `isEmailVerified`) retornados no perfil; frontend ajusta UI/ações conforme isso.


# Design / Styling / Acessibilidade

* CSS: Tailwind CSS ou CSS-in-JS (stitches / emotion). Tokens e sistema de design centralizado (cores, tipografia, espaçamentos).
* Component library: criar um `UI` library com componentes atômicos reutilizáveis.
* Acessibilidade: semantic HTML, roles, aria-labels, foco visível, contrastes adequados — essencial para cards e modais.
* Imagens: lazy-loading, placeholders e otimização para evitar layout shift.

---

# Testes e Qualidade

* Lint / Typecheck: ESLint + ypeScript.
* Unit / Integration: Jest, React Testing Library
* E2E: Ainda não necessário


# CI / CD & deploy (em desenvolvimento, apenas anotações)

* Pipeline sugerido (GitHub Actions):

  * `pull_request` → run lint, typecheck, unit tests.
  * `main` → build, deploy para staging/prod (Vercel/Netlify/Cloudflare Pages).
  Deploy na Vercel

---

# Roadmap & Itens em desenvolvimento / observações

Transparência objetiva — itens que você citou e estado atual:

* ✅ Login com Google e tradicional (JWT + BCrypt no backend).
* ✅ Tela pedindo username único após cadastro.
* ⚠️ Recuperação de senha por email: backend implementa nodemailer + Resend, mas função de envio depende de domínio próprio (ainda não configurado). O frontend já tem UI para isso — mensagens informativas necessárias.
* ⚠️ Verificação de email: optamos por **roles** (`isEmailVerified`) em vez de bloquear onboarding. Frontend deve exibir banners e bloquear ações (ex: criar álbum público) se `isEmailVerified` for false.
* ⚠️ Usuários anônimos: previsto, **ainda não adicionado** no backend — frontend deve ter ganchos e mocks para testes locais.
* Em desenvolvimento: Álbum de conteúdos (UI+UX), Conteúdo detalhado (anotações, compartilhamento, copy-to-library), Comunidade (feed e algoritmo), Reações em anotações, Comentários (inicialmente desligados por padrão).



# Contato e links úteis

* Backend repo: `https://github.com/Seila-dev/watchlist-server`

* Product owner / PM: `erickoliveira3975@gmail.com`
* Linkedin: `https://www.linkedin.com/in/erickrodrigues-dev/`


* Product Designer: `https://www.linkedin.com/in/samara-medeiros-162072a7/`
* UX & UX Writing: `https://www.linkedin.com/in/giovannafantinato/`
* #1 Dev `https://www.linkedin.com/in/mandilorenzo/`
* #2 Dev `https://www.linkedin.com/in/rafael-fink/`

