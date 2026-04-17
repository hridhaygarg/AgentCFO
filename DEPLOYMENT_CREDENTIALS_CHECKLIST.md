# 🔑 layeroi Deployment Credentials Checklist

**Status:** Waiting for credentials  
**Target:** Production deployment in next 30 minutes after you provide credentials

---

## 📋 Required Credentials (Get these now)

### 1. **Supabase** (Database)
- [ ] Project URL: `https://[project].supabase.co`
- [ ] Anon Key (Public): `eyJhbGciOiJIUzI1NiIs...`
- [ ] Service Role Key (Private): `eyJhbGciOiJIUzI1NiIs...`
- [ ] Database Password: `[password]`

**Get from:** Supabase Dashboard > Project Settings > API

### 2. **Resend** (Email Sending)
- [ ] API Key: `re_[key]`

**Get from:** https://resend.com > API Keys

### 3. **Apollo.io** (Lead Generation)
- [ ] API Key: `[api-key]`

**Get from:** https://app.apollo.io > Settings > API

### 4. **Anthropic** (AI for SEO)
- [ ] API Key: `sk-ant-[key]`

**Get from:** https://console.anthropic.com > API Keys

### 5. **GitHub** (Optional - for CI/CD)
- [ ] Personal Access Token: `ghp_[token]`

**Get from:** GitHub > Settings > Developer settings > Personal access tokens

### 6. **Domain** (layeroi.com)
- [ ] Domain registrar access (GoDaddy, Namecheap, etc.)
- [ ] Ability to modify DNS records
- [ ] Current DNS settings (take a screenshot)

---

## 🚀 Deployment Sequence

Once you provide credentials, I will:

### Phase 1: Environment Setup (5 minutes)
```bash
# 1. Create .env files
echo "SUPABASE_URL=[your-url]" > backend/.env.production
echo "RESEND_API_KEY=[your-key]" >> backend/.env.production
echo "ANTHROPIC_API_KEY=[your-key]" >> backend/.env.production
echo "APOLLO_API_KEY=[your-key]" >> backend/.env.production

# 2. Verify environment
npm run validate-env
```

### Phase 2: Database Setup (5 minutes)
```bash
# 1. Connect to Supabase
psql $DATABASE_URL

# 2. Apply migration
\i backend/src/migrations/002_create_cold_email_leads.sql

# 3. Verify tables created
\dt cold_email*
```

### Phase 3: Frontend Deployment (5 minutes)
```bash
# 1. Verify build
cd frontend && npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Test frontend
curl https://layeroi.com
```

### Phase 4: Backend Deployment (5 minutes)
```bash
# 1. Deploy backend
cd backend && vercel --prod

# 2. Test API
curl https://api.layeroi.com/health

# 3. Verify database connection
curl https://api.layeroi.com/api/cold-email/stats
```

### Phase 5: Domain Configuration (3 minutes)
```bash
# 1. Add DNS records
# A record OR CNAME to vercel-dns.com

# 2. Configure in Vercel dashboard
# Settings > Domains > Add layeroi.com

# 3. Verify SSL
curl -I https://layeroi.com
```

### Phase 6: Cron Jobs Setup (3 minutes)
Choose one option:
- **Option A:** Built-in (runs in Node.js process)
- **Option B:** External (cron-job.org) - RECOMMENDED
- **Option C:** GitHub Actions

### Phase 7: Verification (5 minutes)
```bash
# Test all endpoints
curl https://api.layeroi.com/health
curl https://api.layeroi.com/api/cold-email/stats
curl https://layeroi.com

# Check logs
vercel logs

# Monitor cron jobs
# Dashboard > Logs > Check job execution
```

---

## ✅ How to Provide Credentials

**Option 1: Direct Message (Safest)**
Send me these one at a time:
```
1. SUPABASE_URL=https://[project].supabase.co
2. SUPABASE_KEY=[key]
3. RESEND_API_KEY=[key]
...
```

**Option 2: .env File (If you have local setup)**
Create `backend/.env.production` locally and I can guide you through deployment

**Option 3: Environment Variables in Vercel**
You set them in Vercel dashboard, I'll deploy and reference them

---

## ⏱️ Timeline

| Phase | Task | Time |
|-------|------|------|
| Phase 1 | Environment Setup | 5 min |
| Phase 2 | Database Migration | 5 min |
| Phase 3 | Frontend Deploy | 5 min |
| Phase 4 | Backend Deploy | 5 min |
| Phase 5 | Domain Setup | 3 min |
| Phase 6 | Cron Jobs | 3 min |
| Phase 7 | Verification | 5 min |
| **Total** | **Full Deployment** | **31 min** |

---

## 🆘 Troubleshooting

If anything fails during deployment, I have:
- ✅ DEPLOYMENT_FINAL.md - Full troubleshooting guide
- ✅ COMPLETION_SUMMARY.md - Architecture overview
- ✅ All source code - For debugging

---

## 🎯 Success Criteria

After deployment, we'll verify:

✅ Frontend loads at https://layeroi.com
✅ API responds at https://api.layeroi.com/health
✅ Database connected and accepting queries
✅ Email sending configured (test email)
✅ Cron jobs scheduled and running
✅ Dashboard displays metrics
✅ All 14 automation jobs scheduled

---

**Ready to deploy!** 

Just provide the credentials above and I'll get everything live within 30 minutes.

Generated: 2026-04-18
