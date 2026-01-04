# Database Setup Guide

This guide explains how to migrate from the current localStorage architecture to a production-ready database system.

## Current Architecture

**Storage Method**: Zustand stores with localStorage persistence

**How it works**:
- All portfolio data stored in browser's localStorage
- Each Zustand store persists to a unique localStorage key
- Data available only to the specific browser/device
- No server-side persistence or authentication

**Advantages**:
- ✅ Zero backend infrastructure
- ✅ Fast performance (no network requests)
- ✅ Simple deployment (static hosting)
- ✅ No database costs

**Limitations**:
- ❌ Single-user only (data per browser)
- ❌ No cross-device synchronization
- ❌ No backup or recovery
- ❌ Limited to ~5-10MB storage
- ❌ No real authentication
- ❌ Data lost on cache clear

---

## When to Migrate to Database

Migrate if you need:
- **Multi-device access**: Edit from laptop, view from phone
- **Collaboration**: Multiple editors/admins
- **Data backup**: Persistent, recoverable data
- **Authentication**: Secure admin access
- **API access**: Mobile app or external integrations
- **Analytics**: Track views, engagement, conversions
- **Dynamic content**: User comments, contact form submissions
- **Scalability**: Support many users/visitors

---

## Recommended Database: Supabase

**Why Supabase?**
- 🎯 PostgreSQL (powerful, relational)
- 🔒 Built-in authentication
- 🚀 Auto-generated REST & GraphQL APIs
- 📊 Real-time subscriptions
- 💾 Storage for images/files
- 💰 Free tier (500MB database, 1GB file storage)
- 🔧 Easy migration from localStorage

---

## Migration Path: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create new project:
   - Name: `portfolio-cms`
   - Database Password: (generate strong password)
   - Region: Select closest to users
3. Wait for project initialization (~2 minutes)

### Step 2: Run Database Schema

1. Open SQL Editor in Supabase Dashboard
2. Copy schema from `docs/schema/postgresql.sql`
3. Run the SQL script to create tables

Or via CLI:
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Step 3: Configure Environment Variables

Add to `.env.local`:
```bash
# Get from Supabase: Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Step 4: Install Supabase Client

```bash
pnpm add @supabase/supabase-js
```

Create Supabase client:
```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 5: Migrate Data from localStorage

Run the migration script to export localStorage data to Supabase:

```typescript
// scripts/migrate-to-supabase.ts
import { supabase } from '@/lib/supabase/client';

async function migrateProjects() {
  // Get data from localStorage
  const localData = localStorage.getItem('projects-storage');
  const projects = localData ? JSON.parse(localData) : [];

  // Insert into Supabase
  const { data, error } = await supabase
    .from('projects')
    .insert(projects);

  if (error) throw error;
  console.log('Projects migrated:', data);
}

// Run migrations for all stores
async function runMigrations() {
  await migrateProjects();
  await migrateBlogPosts();
  await migrateSkills();
  // ... etc
}

runMigrations();
```

### Step 6: Replace Zustand Stores with Supabase Queries

**Before (localStorage)**:
```typescript
// Using Zustand store
const projects = useProjectsStore(state => state.projects);
```

**After (Supabase)**:
```typescript
// Using Supabase query
async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// In Server Component
export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsList projects={projects} />;
}
```

### Step 7: Add API Routes for Mutations

Create API routes for create/update/delete operations:

```typescript
// app/api/projects/route.ts
import { supabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('projects')
    .insert(body)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
```

### Step 8: Add Authentication

Enable email authentication in Supabase Dashboard:
1. Authentication > Providers > Email
2. Configure redirect URLs

Use Supabase Auth:
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'secure-password',
});

// Protect admin routes
export default async function AdminLayout({ children }) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

---

## Database Schema Overview

### Core Tables

**projects**
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `tech_stack` (text[])
- `live_url` (text)
- `github_url` (text)
- `image_url` (text)
- `featured` (boolean)
- `order_index` (integer)
- `created_at` (timestamp)

**blog_posts**
- `id` (uuid, primary key)
- `title` (text)
- `slug` (text, unique)
- `content` (text)
- `excerpt` (text)
- `cover_image` (text)
- `tags` (text[])
- `published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)

**skills**
- `id` (uuid, primary key)
- `name` (text)
- `category` (text)
- `proficiency` (integer, 0-100)
- `icon` (text)
- `order_index` (integer)

**experiences**
- `id` (uuid, primary key)
- `company` (text)
- `position` (text)
- `description` (text)
- `start_date` (date)
- `end_date` (date, nullable)
- `current` (boolean)
- `technologies` (text[])
- `order_index` (integer)

**testimonials**
- `id` (uuid, primary key)
- `client_name` (text)
- `client_role` (text)
- `client_company` (text)
- `client_avatar` (text)
- `content` (text)
- `rating` (integer, 1-5)
- `featured` (boolean)
- `created_at` (timestamp)

See `docs/schema/postgresql.sql` for complete schema with relationships and indexes.

---

## Alternative Database Options

### Option 2: Vercel Postgres

**Pros**:
- Integrated with Vercel deployment
- Serverless PostgreSQL
- Simple setup

**Cons**:
- More expensive than Supabase free tier
- No built-in auth or file storage

**Setup**:
```bash
# Install Vercel Postgres
pnpm add @vercel/postgres

# In Vercel Dashboard: Storage > Create > Postgres
# Environment variables auto-injected

// Query usage
import { sql } from '@vercel/postgres';

const { rows } = await sql`SELECT * FROM projects`;
```

### Option 3: MongoDB Atlas

**Pros**:
- Flexible schema (NoSQL)
- Free tier: 512MB storage
- Good for unstructured data

**Cons**:
- Different query patterns than SQL
- Less type safety

**Setup**:
```bash
pnpm add mongodb

# Connect
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('portfolio');
const projects = await db.collection('projects').find().toArray();
```

### Option 4: PlanetScale

**Pros**:
- MySQL-compatible
- Branching for schema changes
- Great developer experience

**Cons**:
- Free tier limits

---

## Migration Checklist

- [ ] Choose database provider (Supabase recommended)
- [ ] Create database project
- [ ] Run schema SQL script
- [ ] Configure environment variables
- [ ] Install database client library
- [ ] Export localStorage data to JSON
- [ ] Import data to database
- [ ] Replace Zustand stores with database queries
- [ ] Add API routes for mutations
- [ ] Implement authentication
- [ ] Update admin components to use API
- [ ] Test all CRUD operations
- [ ] Add error handling and loading states
- [ ] Deploy with new environment variables
- [ ] Backup database regularly

---

## Data Migration Script

```typescript
// scripts/export-localstorage.ts
// Run this in browser console to export data

function exportLocalStorageData() {
  const stores = [
    'projects-storage',
    'blog-storage',
    'skills-storage',
    'resume-storage',
    'testimonials-storage',
    'about-storage',
    'hero-storage',
  ];

  const exportData: Record<string, any> = {};

  stores.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      exportData[key] = JSON.parse(data);
    }
  });

  // Download as JSON
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data-export.json';
  a.click();
}

exportLocalStorageData();
```

---

## Performance Considerations

### Caching Strategy
```typescript
// Use React Cache for deduplication
import { cache } from 'react';

export const getProjects = cache(async () => {
  const { data } = await supabase.from('projects').select('*');
  return data;
});
```

### Pagination
```typescript
// Paginate large datasets
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .range(0, 9) // First 10 items
  .order('published_at', { ascending: false });
```

### Indexes
Ensure proper indexes in schema:
```sql
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
```

---

## Security Best Practices

1. **Use Row Level Security (RLS)** in Supabase:
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view published projects"
ON projects FOR SELECT
USING (published = true);

-- Admin write access
CREATE POLICY "Authenticated users can manage projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated');
```

2. **Validate inputs** with Zod before database insertion
3. **Use service role key** only in server-side code
4. **Sanitize user inputs** to prevent SQL injection
5. **Rate limit API routes** to prevent abuse

---

## Support & Troubleshooting

**Common Issues**:

- **Connection errors**: Check environment variables are set correctly
- **Permission denied**: Verify RLS policies in Supabase
- **Schema mismatch**: Ensure migrations ran successfully
- **Slow queries**: Add indexes on frequently queried columns

**Resources**:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Database Integration](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)

---

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System design and patterns
- [State Management](./STORES.md) - Zustand store documentation
- [API Reference](./API.md) - API routes
- [Getting Started](./GETTING_STARTED.md) - Quick start guide

---

**Need help?** Open an issue on GitHub or contact support.
