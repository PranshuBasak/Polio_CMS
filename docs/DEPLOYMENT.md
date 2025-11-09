# Deployment Guide

Complete guide for deploying your Portfolio CMS to production.

## Table of Contents
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Environment Configuration](#environment-configuration)
- [Custom Domain Setup](#custom-domain-setup)
- [Performance Optimization](#performance-optimization)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

**Why Vercel?**
- ✅ Optimized for Next.js (built by same team)
- ✅ Automatic HTTPS and CDN
- ✅ Zero-config deployment
- ✅ Preview deployments for PRs
- ✅ Built-in analytics
- ✅ Free for personal projects

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub, GitLab, or Bitbucket:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel auto-detects Next.js configuration

### Step 3: Configure Build Settings

Vercel auto-detects these, but verify:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node Version | 18.x or 20.x |

### Step 4: Add Environment Variables

In Vercel Dashboard > Project > Settings > Environment Variables:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Portfolio
LOG_LEVEL=info

# Optional - Database (if using)
DATABASE_URL=your-database-connection-string
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional - Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=your-email@example.com
```

**Pro Tip**: Add variables for all environments:
- Production
- Preview
- Development

### Step 5: Deploy

Click **"Deploy"** button. Vercel will:
1. Clone your repository
2. Install dependencies
3. Run `pnpm build`
4. Deploy to CDN
5. Provide deployment URL

**Deployment time**: ~2-3 minutes

### Step 6: Verify Deployment

1. Visit provided URL (e.g., `your-project.vercel.app`)
2. Test all pages:
   - Homepage: `/`
   - Projects: `/projects`
   - Blog: `/blog`
   - Admin: `/admin`
3. Check console for errors (F12)
4. Test responsive design on mobile

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to `main` branch:

```bash
git add .
git commit -m "Update content"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

---

## Docker Deployment

For self-hosted or custom infrastructure.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["pnpm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
      - LOG_LEVEL=info
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t portfolio-cms .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  portfolio-cms

# Or use docker-compose
docker-compose up -d
```

---

## Manual Deployment

For VPS (DigitalOcean, AWS EC2, Linode, etc.)

### Prerequisites

- Ubuntu 22.04 LTS (recommended)
- Node.js 18+ installed
- Nginx or Apache
- Domain pointing to server IP

### Step 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
npm install -g pm2
```

### Step 2: Clone and Build

```bash
# Clone repository
git clone https://github.com/yourusername/portfolio-cms.git
cd portfolio-cms

# Install dependencies
pnpm install

# Create .env.local
nano .env.local
# Add your environment variables

# Build
pnpm build
```

### Step 3: Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'portfolio-cms',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/path/to/portfolio-cms',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
```

Start application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

Create `/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-renews. Test renewal:

```bash
sudo certbot renew --dry-run
```

---

## Environment Configuration

### Production Environment Variables

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Portfolio
LOG_LEVEL=info

# Enable analytics in production
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Rate limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Security
ALLOWED_ORIGINS=https://yourdomain.com
```

### Secrets Management

**Never commit secrets to Git!**

**Vercel**: Use dashboard environment variables

**Docker**: Use `.env` file or secrets manager:
```bash
docker run --env-file .env.production portfolio-cms
```

**VPS**: Use environment variables in PM2 config or systemd

---

## Custom Domain Setup

### Vercel

1. Go to Project > Settings > Domains
2. Add your domain: `yourdomain.com`
3. Vercel provides DNS instructions
4. Add DNS records at your domain registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (~10 minutes)
6. Vercel auto-provisions SSL certificate

### Custom Server

1. Point A record to server IP
2. Configure Nginx as shown above
3. Setup SSL with Certbot

---

## Performance Optimization

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  // Enable React Compiler
  experimental: {
    reactCompiler: true,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Compression
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Caching Strategy

- **Static Assets**: Cache forever (`max-age=31536000`)
- **Pages**: ISR with revalidation or on-demand
- **API Routes**: Cache with Redis or short TTL

### CDN Configuration

Vercel automatically uses global CDN. For custom:
- Cloudflare (free CDN + DDoS protection)
- AWS CloudFront
- Fastly

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm run type-check

      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Monitoring & Analytics

### Vercel Analytics

Already integrated via `@vercel/analytics`. View in Vercel Dashboard.

### Google Analytics

Add to `.env.production`:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Error Tracking with Sentry

```bash
pnpm add @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring

- **UptimeRobot** (free, 50 monitors)
- **Pingdom**
- **StatusCake**

Setup checks for:
- Homepage: `https://yourdomain.com`
- API health: `https://yourdomain.com/api/health`

---

## Troubleshooting

### Build Fails

**Error**: Module not found
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

**Error**: Type errors
```bash
# Run type check locally
pnpm run type-check

# Fix TypeScript errors before deploying
```

### 500 Internal Server Error

Check logs:
- **Vercel**: Dashboard > Deployments > View Function Logs
- **PM2**: `pm2 logs portfolio-cms`
- **Docker**: `docker logs container-name`

Common causes:
- Missing environment variables
- Database connection failed
- API route errors

### Slow Performance

1. **Enable production mode**: Set `NODE_ENV=production`
2. **Check bundle size**: `pnpm build` shows bundle analysis
3. **Use lighthouse**: Test performance score
4. **Enable compression**: Gzip/Brotli in Nginx/Vercel
5. **Optimize images**: Use `next/image` component

### Database Connection Issues

```typescript
// Test database connection
import { supabase } from '@/lib/supabase/client';

async function testConnection() {
  const { data, error } = await supabase
    .from('projects')
    .select('count');

  console.log('Connection:', error ? 'Failed' : 'Success');
}
```

---

## Deployment Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Database migrations run (if using database)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics integrated
- [ ] Error tracking setup
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt configured: `/robots.txt`
- [ ] All admin routes protected
- [ ] Contact form tested
- [ ] Mobile responsive verified
- [ ] Performance score >90 (Lighthouse)
- [ ] SEO metadata complete
- [ ] Social sharing tested (OpenGraph)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Backup strategy in place

---

## Production Best Practices

1. **Monitor uptime** with external service
2. **Setup alerts** for errors (Sentry, email)
3. **Regular backups** of database
4. **Keep dependencies updated** monthly
5. **Review logs** weekly for issues
6. **Test deployments** in staging first
7. **Document changes** in CHANGELOG
8. **Version control** for rollbacks

---

## Support

**Deployment issues?**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [GitHub Issues](https://github.com/yourusername/portfolio-cms/issues)

**Need help?** Open an issue or contact support.

---

**🎉 Congratulations on deploying your portfolio!**
