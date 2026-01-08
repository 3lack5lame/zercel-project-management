# Deploy ProjectHub to InfinityFree with Supabase

## 🎯 Complete Setup Guide

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free tier is perfect)
3. Create new project:
   - **Name:** ProjectHub
   - **Password:** Save it!
   - **Region:** Choose closest to you
4. Wait 2 minutes for initialization

### Step 2: Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (example: `https://xxxx.supabase.co`)
   - **anon public** (long key starting with `eyJ...`)

### Step 3: Configure Your Local App

1. Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace with your actual Supabase credentials
3. Test locally: `npm run dev`

### Step 4: Build for Production

```bash
npm run build
```

This creates a `dist` folder with all files ready to deploy.

### Step 5: Deploy to InfinityFree

#### Method A: Using File Manager (Easiest)

1. Login to InfinityFree control panel
2. Click **File Manager**
3. Navigate to `/public_html`
4. **Delete everything** in this folder
5. Click **Upload Files**
6. Select **all files from the `dist` folder**
7. Upload them

#### Method B: Using FTP

1. Install FTP client (FileZilla recommended)
2. Get FTP credentials from InfinityFree control panel
3. Connect to your FTP server
4. Navigate to `/public_html`
5. Delete existing files
6. Upload all files from `dist` folder

## Automatic deploy from GitHub

You can automatically build and sync your site to InfinityFree whenever you push to the `main` branch using GitHub Actions. A workflow file has been added at `.github/workflows/deploy-infinityfree.yml` which:

- Installs dependencies (`npm ci`)
- Runs `npm run build`
- Uploads the `dist` folder to your InfinityFree hosting via FTP/FTPS

Required GitHub Secrets (Repository → Settings → Secrets → Actions):

- `INF_HOST` — your InfinityFree FTP hostname (for many accounts this is `ftpupload.net`)
- `INF_USERNAME` — your FTP username
- `INF_PASSWORD` — your FTP password
- `INF_SERVER_DIR` — remote directory to upload to (common value: `/htdocs` or `/public_html`)

After adding the secrets, any push to `main` will trigger the workflow and sync the `dist` folder to InfinityFree.

Note: If the site does not update, check the workflow run logs in the GitHub Actions tab and verify FTP credentials and `INF_SERVER_DIR` are correct.

### Step 6: Configure InfinityFree

1. Go to InfinityFree control panel
2. Go to **Settings** → **General**
3. Set **Document Root** to `/public_html`
4. Ensure **index.html** is in the root

### Step 7: Test Your App

Visit your InfinityFree domain (example: `yourname.infinityfree.com`)

✅ You should see the login page
✅ Authentication works with Supabase
✅ All features are live

## 🔧 Important Configuration Notes

### Environment Variables on InfinityFree

Your `.env.local` won't work on the server. Instead:

#### Option A: Build with Env Variables

```bash
# Before building, ensure .env.local has your credentials
VITE_SUPABASE_URL=https://xxxx.supabase.co npm run build
```

This bakes the credentials into the build (safe because they're frontend credentials).

#### Option B: Using .htaccess

Create `.htaccess` in `/public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures all routes redirect to index.html (needed for React Router).

## 📋 Pre-Deployment Checklist

Before deploying:

- [ ] Supabase project created
- [ ] Credentials copied to `.env.local`
- [ ] App works locally: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] `dist` folder has files
- [ ] InfinityFree account ready
- [ ] FTP/File Manager access working

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Visit your domain
- [ ] See login page
- [ ] Try signup with email
- [ ] Check Supabase dashboard for new user
- [ ] Try login
- [ ] Try password reset (check email)
- [ ] Try logout
- [ ] Refresh page - should stay logged in
- [ ] Check browser console - no errors

## 🆘 Troubleshooting

### "Cannot GET /" after upload
- Check `index.html` is in `/public_html`
- Create `.htaccess` with rewrite rules
- Restart server from control panel

### Login not working
- Check `.env.local` credentials
- Verify Supabase URL and key in build
- Check Supabase dashboard - service enabled?
- Clear browser cache

### "Supabase connection failed"
- Ensure VITE variables baked in build
- Check Supabase project is active
- Verify network in DevTools
- Check Supabase status page

### Page stuck loading
- Check browser console for errors
- Verify Supabase credentials
- Clear localStorage: `localStorage.clear()`
- Try incognito mode
- Hard refresh: Ctrl+Shift+R

### Email not sending
- Free Supabase uses `noreply@mail.supabase.io`
- Check spam folder
- Upgrade Supabase for custom email
- Check auth settings in Supabase

## 🚀 Performance Tips

### Optimize Build Size

```bash
npm run build
```

Check dist size: `du -sh dist/`
- Target: < 500KB (gzipped)

### Cache Settings

Supabase handles caching automatically for:
- User sessions
- Authentication tokens
- Database queries

No additional caching needed.

## 📊 Monitoring

### Check Live Usage

1. Go to Supabase dashboard
2. Check **Auth** → **Users** for signups
3. Check **Logs** for activity
4. Monitor **Storage** usage

### Free Tier Limits

- 50,000 monthly active users
- Unlimited API requests
- 500MB database
- 1GB storage

Your app easily fits in free tier!

## 💾 Backup & Updates

### Backup Data

Supabase auto-backups daily. To export:

1. Go to Supabase dashboard
2. **Settings** → **Database**
3. Click **Download backup**

### Update App

To push new changes:

```bash
# 1. Make changes
# 2. Build new version
npm run build

# 3. Upload dist files again
# Same process as initial deployment
```

## 🔐 Security Notes

### What's Exposed

✅ Public API Key (safe)
✅ Supabase URL (safe)
❌ Service Role Key (keep secret!)
❌ Database password (keep secret!)

### Best Practices

- Never expose service role key
- Never commit credentials to git
- Use Row-Level Security in Supabase
- Enable email verification
- Set rate limits on auth endpoints

## 🎯 Next Steps

After deployment:

1. ✅ Test all features
2. ✅ Set up custom domain (optional)
3. ✅ Configure email templates in Supabase
4. ✅ Enable 2FA (optional)
5. ✅ Monitor user growth
6. ✅ Plan upgrades

## 📞 Support

### Stuck?

1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Check [AUTHENTICATION.md](./AUTHENTICATION.md)
3. Review [AUTH_QUICKSTART.md](./AUTH_QUICKSTART.md)
4. Check Supabase docs: https://supabase.com/docs
5. InfinityFree help: https://infinityfree.net/support

## 💡 Pro Tips

### Custom Domain

InfinityFree supports free subdomains. To use custom domain:
1. Add domain to InfinityFree control panel
2. Update DNS at your registrar
3. Wait for propagation (up to 48 hours)

### Email Customization

In Supabase dashboard:
- Go to **Authentication** → **Email Templates**
- Customize password reset email
- Add your branding
- Add app logo

### Monitoring

Set up email alerts:
- Supabase → **Settings** → **Billing**
- Add email for quota alerts
- Get notifications when approaching limits

---

**Your ProjectHub is now live with real authentication!** 🎉

Questions? Check the documentation files or visit [Supabase Docs](https://supabase.com/docs)
