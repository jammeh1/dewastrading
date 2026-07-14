# Bati-Ngalun Admin Dashboard — Setup Guide

## What was added

Three new files have been added to your project:

```
src/
  pages/
    Admin.tsx          ← Auth state handler (entry point)
    AdminLogin.tsx     ← Login screen
    AdminDashboard.tsx ← Full dashboard UI
admin-setup.sql        ← SQL to run in Supabase
```

`App.tsx` was updated to add a `/admin` route — **the route is invisible on the main site** (no link, no button, nothing).

---

## Step 1 — Supabase Database Setup

1. Open your Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Open and run the file `admin-setup.sql` from this repo
4. This creates:
   - `posts` table with proper columns and section support
   - Row Level Security (public reads published only, admin has full access)
   - Storage policies for `blog-images` bucket

---

## Step 2 — Create Your Admin User

1. In Supabase, go to **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter your email (e.g. `admin@bati-ngalun.com`) and a strong password
4. Click **Create user**

> This is the only account that can log into `/admin`. No one else can.

---

## Step 3 — Verify Storage Bucket

1. In Supabase, go to **Storage**
2. Make sure the `blog-images` bucket exists
3. Confirm it is set to **Public**
4. If it doesn't exist, create it:
   - Name: `blog-images`
   - Public: **Yes**
   - File size limit: 50MB
   - Allowed MIME: `image/jpeg, image/png, image/webp, image/gif`

---

## Step 4 — Deploy

Push the updated code to GitHub:

```bash
git add .
git commit -m "Add admin dashboard at /admin"
git push
```

Your GitHub Actions workflow will deploy automatically.

---

## Accessing the Admin Panel

Visit: **https://bati-ngalun.com/admin**

> This URL is not linked anywhere on the public site. It will never appear in navigation or footers.

---

## Admin Dashboard Features

### Dashboard Overview
- Live stats: total posts, published, drafts, images
- Quick navigation to all sections
- Site status and info panel

### Content Management (per nav section)
Each section — Home, About, Waterworks, Real Estate, Agriculture, Foundation, Projects, Careers, Contact — has its own content manager where you can:
- ✅ Create new posts with title, content, featured image, and status
- ✅ Edit existing posts
- ✅ Delete posts (with confirmation)
- ✅ Toggle published / draft status
- ✅ Upload images directly from the editor

### Media Library
- Upload single or multiple images at once
- Grid view of all images in `blog-images` bucket
- Copy image URL to clipboard (one click)
- Delete images
- Search/filter by filename

---

## Connecting Content to the Main Site

Posts are stored with a `section` field (e.g. `waterworks`, `agriculture`). 

Your `supabase.ts` already has `getLatestImageByCategory()`. To display dynamic content from posts in a section, add this pattern to any page component:

```tsx
import { supabase } from '@/lib/supabase';

// In your component:
const [sectionPosts, setSectionPosts] = useState([]);

useEffect(() => {
  supabase
    .from('posts')
    .select('*')
    .eq('section', 'waterworks')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .then(({ data }) => setSectionPosts(data || []));
}, []);
```

---

## Security Notes

- The `/admin` route requires Supabase authentication — unauthenticated visitors see the login screen
- Supabase Row Level Security ensures the database rejects unauthorized writes even if someone bypasses the UI
- The admin user is managed entirely in Supabase Auth — no passwords are stored in code
- There is no "forgot password" link shown publicly; reset passwords from the Supabase dashboard

---

## Brand Colors Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Green | `#1a5f2a` | Primary brand, nav active |
| Blue | `#0077BE` | Links, CTAs |
| Light Green | `#7CB342` | Accents, success states |
| Footer Dark | `#1a3a2a` | Admin sidebar background |
| Blue Light | `#4A90E2` | Secondary blue, icons |
