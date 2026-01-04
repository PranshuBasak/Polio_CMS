# Environment Variables

Configuration for the application environment.

## `.env.local`

Create this file in the root directory.

```bash
# General
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="DynamicFolio"

# Logging
LOG_LEVEL="debug" # debug | info | warn | error

# Supabase (Future)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Analytics (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=""
```

## Type Safety

We do not currently have a `env.ts` validation file (e.g., using `t3-env`), but it is recommended for the future.

> [!WARNING]
> Never commit `.env.local` to version control. It is added to `.gitignore`.
