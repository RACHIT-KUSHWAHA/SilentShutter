## Silent Shutter – Zero Budget Photography Platform

Silent Shutter is Rachit’s public photo sketchbook: a statically hosted Next.js site with a ratings system that runs on free-tier services. It highlights featured frames, metadata-rich stories, and a gallery filter without relying on paid infrastructure.

### Features

- Hero + featured story with Cloudinary/Unsplash-ready imagery and transparent camera metadata.
- Interactive gallery filter with categories (Street, Nature, Portrait, Documentary, Personal).
- Client-side rating widget that writes to Firebase (if configured) or falls back to local storage for offline demos.
- Detail page per photo with EXIF-style data, story notes, and upvote CTA.
- Newsletter-style callout you can wire to Mailchimp free tier.

### Stack & Services (all free tiers)

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS 4.
- **Auth/Ratings**: Firebase Firestore client SDK with anonymous auth, debounced writes, and local fallback.
- **Image delivery**: Cloudinary folders per category (`silent-shutter/<category>/...`) using `f_auto,q_auto,w_1600` production URLs and `e_blur:1000,q_1,w_20` placeholders.
- **Hosting**: Vercel / Netlify / Cloudflare Pages – all work out of the box.

### Environment Variables

Create a `.env.local` file for local development (all optional – omit to stay in offline/local-storage mode):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=app-id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name (optional – falls back to demo URLs)
```

If you leave `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` blank, Unsplash demo URLs are used. Replace the sample `silent-shutter/<category>/<slug>.jpg` paths in `src/data/photos.ts` with your actual public IDs once uploaded.

Firebase security rules live in `firebase.rules`:

```
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /photoRatings/{photoId} {
			allow read: if true;
			allow write: if request.auth != null;
		}
	}
}
```

Enable anonymous auth in Firebase Authentication so the rating hook can sign users in before writing.

### Admin Uploads

A private upload page is available at `/admin` for the owner to add new photos.

1. Set `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `ADMIN_PASSWORD` in `.env.local`.
2. Visit `/admin` and enter your password.
3. Upload a photo, fill in metadata, and it will automatically sync to Cloudinary and Firestore.

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and start editing files inside `src/`.

### Quality Checks

```bash
npm run lint
npm run build
```

### Zero-Budget Deployment Playbook

1. **Repo hosting**: Push this folder to GitHub (private or public).  
2. **Hosting**: Connect the repo to Vercel or Netlify (both free). Build command `npm run build`, output `.next`.  
3. **Image storage**: Upload your frames to Cloudinary free plan and swap URLs inside `src/data/photos.ts`.  
4. **Ratings backend**: Create a Firebase project, enable Firestore + anonymous auth, deploy `firebase.rules`, copy env vars, and redeploy. Without these vars the UI still works using browser storage.  
5. **Newsletter**: Embed a Mailchimp form URL in `CommunityCallout` once you create a free audience list.

### Project Structure Highlights

- `src/app/page.tsx` – landing page with hero, featured photo, gallery, CTA.  
- `src/app/photo/[slug]/page.tsx` – dynamic detail pages pre-generated from the data file.  
- `src/data/photos.ts` – single source of truth for all frames/metadata + Cloudinary helpers.  
- `firebase.rules` – Firestore security used by the rating widget.
- `src/hooks/useRating.ts` – handles Firestore vs localStorage vote tracking.  
- `src/components/*` – composable UI building blocks (gallery grid, rating button, community CTA).

### Next Steps

- Replace placeholder image URLs with your Cloudinary uploads.  
- Plug in actual Firebase config to sync votes across devices.  
- Add Mailchimp action URL inside `CommunityCallout` to collect email subscribers.  
- When budget appears, add comment threads or gated downloads via Supabase/Auth.
