# 🚀 Complete Deployment Guide

## Overview

This guide covers deploying both the frontend and backend of your Expense Tracker application.

---

## 📋 Pre-Deployment Checklist

### Backend (.env Configuration)

- [ ] `MONGODB_URI` is set (MongoDB Atlas recommended for production)
- [ ] `JWT_SECRET` is a strong, randomly generated string
- [ ] `NODE_ENV` is set to `production`
- [ ] `CORS_ORIGIN` matches your frontend URL
- [ ] All environment variables are secure (no test values)

### Frontend

- [ ] API endpoint configured correctly
- [ ] Build process tested locally
- [ ] All dependencies installed

### Security

- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in code
- [ ] Strong JWT secret generated
- [ ] MongoDB IP whitelist configured

---

## 🌐 Backend Deployment

### Option 1: Render (Recommended - Free Tier)

1. **Prepare Your Code:**
   - Commit all changes to Git
   - Push to GitHub

2. **Create Render Account:**
   - Go to [render.com](https://render.com/)
   - Sign up with GitHub

3. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name:** expense-tracker-api
     - **Region:** Choose closest to you
     - **Branch:** main
     - **Root Directory:** server
     - **Runtime:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   PORT=5000
   DB_NAME=expense_tracker_prod
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Your API will be at: `https://expense-tracker-api.onrender.com`

6. **Test Deployment:**
   ```bash
   curl https://expense-tracker-api.onrender.com/health
   ```

### Option 2: Railway

1. **Create Account:**
   - Go to [railway.app](https://railway.app/)
   - Sign in with GitHub

2. **Deploy:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js

3. **Configure:**
   - Go to Variables tab
   - Add all environment variables (same as Render above)
   - Set root directory: `server`

4. **Custom Domain (Optional):**
   - Go to Settings → Domains
   - Generate domain or add custom

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or download from heroku.com
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   cd server
   heroku create expense-tracker-api
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CORS_ORIGIN=https://your-frontend.com
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open:**
   ```bash
   heroku open
   ```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI (Optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web:**
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** ./
     - **Build Command:** `npm run build`
     - **Output Directory:** dist

3. **Environment Variables:**
   ```
   VITE_API_URL=https://expense-tracker-api.onrender.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Your app will be at: `https://your-app.vercel.app`

5. **Custom Domain (Optional):**
   - Go to Settings → Domains
   - Add your custom domain

### Option 2: Netlify

1. **Connect Repository:**
   - Go to [netlify.com](https://netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

2. **Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

3. **Environment Variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add: `VITE_API_URL=https://your-backend-url.com/api`

4. **Deploy:**
   - Click "Deploy site"
   - Your app will be at: `https://your-app.netlify.app`

### Option 3: Render (Static Site)

1. **Create Static Site:**
   - Go to Render dashboard
   - Click "New +" → "Static Site"
   - Connect repository

2. **Configure:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://expense-tracker-api.onrender.com/api
   ```

4. **Deploy:**
   - Click "Create Static Site"

---

## 🔄 Update CORS After Frontend Deployment

After deploying your frontend, update the backend CORS settings:

1. **Get your frontend URL:**
   - Example: `https://expense-tracker.vercel.app`

2. **Update Backend Environment Variable:**
   - Go to your backend hosting (Render/Railway/Heroku)
   - Update `CORS_ORIGIN` to your frontend URL
   - Redeploy if necessary

---

## 🧪 Post-Deployment Testing

### Test Backend:

```bash
# Health check
curl https://your-backend-url.com/health

# Register test user
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Frontend:

1. Open your deployed frontend URL
2. Register a new account
3. Set monthly income
4. Add expenses
5. Check all features work

---

## 📊 Monitoring & Logs

### Render:

- Go to your service → Logs tab
- View real-time logs

### Railway:

- Go to your project → Deployments
- Click on deployment → View Logs

### Heroku:

```bash
heroku logs --tail -a expense-tracker-api
```

---

## 🔧 Common Deployment Issues

### CORS Errors

**Issue:** `Access-Control-Allow-Origin error`

**Fix:**
1. Verify `CORS_ORIGIN` in backend matches frontend URL exactly
2. Include protocol (`https://`) and no trailing slash
3. Redeploy backend after changing

### MongoDB Connection Failed

**Issue:** `MongooseServerSelectionError`

**Fix:**
1. Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0` or Render IPs)
2. Verify connection string is correct
3. Ensure password doesn't contain special characters (URL encode if needed)

### Build Failures

**Issue:** Build fails during deployment

**Fix:**
1. Test build locally: `npm run build`
2. Check all dependencies are in `package.json` (not devDependencies if needed)
3. Review build logs for specific errors

### Environment Variables Not Working

**Issue:** App can't access environment variables

**Fix:**
1. For frontend (Vite): Use `VITE_` prefix
2. For backend: No prefix needed
3. Restart/redeploy after adding variables

---

## 🔐 Production Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS enabled (automatic on Vercel/Render/Railway)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] No hardcoded credentials
- [ ] Environment variables properly set
- [ ] CORS restricted to frontend domain only
- [ ] Rate limiting considered (for future)
- [ ] Input validation on all endpoints
- [ ] Secure password hashing (bcrypt - already implemented)

---

## 📈 Scaling Considerations

### Free Tier Limitations:

**Render Free:**
- Spins down after 15 min inactivity
- First request after sleep is slow (cold start)

**Railway Free:**
- $5 credit/month
- Good for low traffic

**MongoDB Atlas Free (M0):**
- 512 MB storage
- Shared cluster
- Perfect for personal use

### Upgrade When:

- You have consistent traffic
- Need faster response times
- Require more database storage
- Want custom domains on backend

---

## 🎯 Quick Deployment Summary

### Fastest Setup (Recommended):

1. **Backend:** Render
   - Free, no credit card
   - Auto-deploys from GitHub
   - Easy environment variables

2. **Frontend:** Vercel
   - Fastest build times
   - Automatic HTTPS
   - Global CDN

3. **Database:** MongoDB Atlas Free Tier
   - No credit card for M0
   - Reliable cloud database

### Total Time: ~15 minutes

### Total Cost: $0

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Deployment](https://www.mongodb.com/docs/atlas/getting-started/)
- [Railway Documentation](https://docs.railway.app/)

---

**Last Updated:** October 25, 2025
