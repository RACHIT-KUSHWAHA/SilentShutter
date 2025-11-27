# 📸 SilentShutter

> **A minimalist, high-performance photography portfolio platform.**
> Built for photographers to showcase their work with elegance and speed.

![Project Banner](https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop)

## ✨ Features

- **🎨 Masonry Gallery**: Beautiful, responsive grid layout that respects original aspect ratios.
- **⚡ Blazing Fast**: Built on Next.js 15 for optimal performance and SEO.
- **🔐 User Accounts**: Secure Google Authentication via Firebase.
- **☁️ Cloudinary Integration**: High-quality image hosting with automatic optimization.
- **📱 Mobile Optimized**: Fully responsive design with a dedicated mobile experience.
- **🛠️ Admin Dashboard**: Easy-to-use interface for uploading and managing photos.
- **🏷️ EXIF Data**: Automatically extracts and displays camera settings (ISO, Aperture, Shutter Speed).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Firebase Firestore](https://firebase.google.com/)
- **Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Storage**: [Cloudinary](https://cloudinary.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase Project
- A Cloudinary Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SilentShutter.git
   cd SilentShutter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # ... other firebase config
   
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to see your gallery!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Rachit Kushwaha](https://github.com/RACHIT-KUSHWAHA)
