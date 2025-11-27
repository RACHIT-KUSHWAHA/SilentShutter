# 🚀 Deployment Guide for Silent Shutter

This guide will help you deploy Silent Shutter to Netlify and publish your code to GitHub.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are set in `.env.local`
- [ ] Application works correctly on `localhost:3000`
- [ ] Firebase authentication is configured
- [ ] Cloudinary is set up for image uploads
- [ ] No sensitive data in source code

## 🔐 Security Check

Before deploying, verify:

1. **`.env.local` is NOT committed**
   ```bash
   git status
   # Should NOT show .env.local
   ```

2. **`.gitignore` includes `.env*`**
   - Already configured ✅

3. **No hardcoded secrets in code**
   - Already verified ✅

## 📤 Step 1: Push to GitHub

### Create a New Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `silent-shutter`)
3. **Do NOT** initialize with README (we already have one)

### Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Silent Shutter photography platform"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/silent-shutter.git

# Push to GitHub
git push -u origin main
```

## 🌐 Step 2: Deploy to Netlify

### Option A: Netlify Dashboard (Recommended)

1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your `silent-shutter` repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 or higher

4. **Add Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add each variable from your `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
     CLOUDINARY_API_KEY
     CLOUDINARY_API_SECRET
     NEXT_PUBLIC_OWNER_ID (optional)
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## 🔧 Step 3: Configure Firebase for Production

### Add Production Domain to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings**
4. Scroll to **Authorized domains**
5. Click **Add domain**
6. Add your Netlify domain: `your-site-name.netlify.app`
7. Click **Save**

### Update Firestore Security Rules

Make sure your `firebase.rules` are deployed:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## ✅ Step 4: Verify Deployment

### Test Your Production Site

1. **Homepage**
   - Visit `https://your-site-name.netlify.app`
   - Verify photos load correctly

2. **Authentication**
   - Go to `/auth`
   - Test Google sign-in
   - Test email/password sign-up

3. **Photo Upload**
   - Sign in
   - Go to `/admin`
   - Try uploading a photo

4. **User Profile**
   - Verify your photos appear on homepage
   - Test category filtering

## 🎨 Step 5: Customize Your Domain (Optional)

### Add Custom Domain

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS
4. Add custom domain to Firebase authorized domains

## 🔄 Continuous Deployment

Netlify automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Netlify will automatically rebuild and deploy
```

## 📊 Monitoring

### Netlify Dashboard

- **Build logs**: Check for errors
- **Deploy previews**: Test before going live
- **Analytics**: Monitor traffic (paid feature)

### Firebase Console

- **Authentication**: Monitor user signups
- **Firestore**: Check database usage
- **Storage**: Monitor Cloudinary usage

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Solution**: Run `npm install` locally and commit `package-lock.json`

**Error**: `Environment variable not found`
- **Solution**: Double-check all env vars in Netlify dashboard

### Authentication Not Working

**Error**: `auth/unauthorized-domain`
- **Solution**: Add your Netlify domain to Firebase authorized domains

### Images Not Loading

**Error**: Cloudinary images 404
- **Solution**: Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct

## 📝 Post-Deployment Tasks

- [ ] Test all features on production
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Share your portfolio! 🎉

## 🆘 Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Congratulations! Your photography portfolio is now live! 🎊**
