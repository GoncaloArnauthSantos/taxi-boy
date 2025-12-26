## Sentry Integration

Esta app está integrada com o [Sentry](https://sentry.io/) para monitorizar erros e (opcionalmente) performance.

### 1. Ficheiros principais

- **Config global Sentry**
  - `sentry.server.config.ts` – inicialização no servidor (API routes, Server Components, RSC).
  - `sentry.edge.config.ts` – inicialização em Edge Runtime (middleware, edge routes).
- **App Router**
  - `src/instrumentation.ts` – regista o Sentry por runtime (`nodejs` vs `edge`).
  - `src/instrumentation-client.ts` – inicialização no cliente (browser) + tracking de navegação.
  - `src/app/global-error.tsx` – captura global de erros React não tratados.
- **Logger central**
  - `src/lib/logger.ts` – `logError`, `logInfo`, `logWarning` com `LogModule` e envio para Sentry.

### 2. Variáveis de ambiente

Define estas variáveis em `.env.local` (dev) e em Vercel (prod/preview):

**Server-side (API routes, Server Components, Edge Runtime):**
```env
SENTRY_DSN=PASTE_AQUI_O_DSN_DO_SENTRY
SENTRY_ENVIRONMENT=development        # ex.: development, preview, production
SENTRY_TRACES_SAMPLE_RATE=1          # dev: 1, prod: algo como 0.1
```

**Client-side (browser):**
```env
NEXT_PUBLIC_SENTRY_DSN=PASTE_AQUI_O_DSN_DO_SENTRY
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=1
```

Notas:

- **Server-side**: Usa `SENTRY_DSN` (sem `NEXT_PUBLIC_`) porque estas variáveis não são expostas ao browser.
- **Client-side**: Usa `NEXT_PUBLIC_SENTRY_DSN` porque o Next.js só expõe variáveis com este prefixo ao browser.
- `SENTRY_ENVIRONMENT` / `NEXT_PUBLIC_SENTRY_ENVIRONMENT` é o nome que vais ver no dashboard do Sentry.
- `SENTRY_TRACES_SAMPLE_RATE` / `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` controla a amostragem de performance/traces.
- **Importante**: O DSN do Sentry é público e seguro de expor no client-side. Não contém informações sensíveis.

### 3. Como funcionam os logs

- Usa o logger central:

```ts
import { logError, logInfo, LogModule } from "@/lib/logger";

logError("Falha a criar booking", error, { bookingId }, LogModule.API);
logInfo("Booking criado com sucesso", { bookingId }, LogModule.Booking);
```

- **Em todos os ambientes**
  - `logError` faz sempre `console.error` com:
    - prefixo `[API]`, `[CMS]`, `[Email]`, etc. (via `LogModule`)
    - `context` (bookingId, tourId, etc.)
- **Só em produção (`NODE_ENV === "production"`)**
  - `logError` também envia para Sentry via `Sentry.captureException`, com:
    - `tags.module` e `tags.nodeEnv`
    - `extra` com `message` + `context`.

`logInfo` e `logWarning` são usados apenas para debug (não enviam nada para o Sentry por enquanto).

### 4. Testar a integração

1. Garante que tens as env vars definidas (`SENTRY_DSN`, `SENTRY_ENVIRONMENT`).
2. Corre a aplicação em dev:

```bash
npm run dev
```

3. Abre a página de exemplo da Sentry:
   - `http://localhost:3000/sentry-example-page`
   - Segue as instruções da própria página para gerar um erro.
4. Verifica no dashboard do Sentry se o erro apareceu com:
   - o ambiente correto (`SENTRY_ENVIRONMENT`)
   - as tags esperadas.

Também podes forçar um erro num endpoint que use `logError` e confirmar que:

- Vês o log na consola/Vercel.
- Em produção, o erro aparece no Sentry com `module` + `context`.


