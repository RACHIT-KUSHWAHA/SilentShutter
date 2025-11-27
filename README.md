# 📸 SilentShutter

> **A minimalist, high-performance photography portfolio platform.**
> Built for photographers to showcase their work with elegance and speed.

---

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **🎨 Masonry Gallery** | Beautiful, responsive grid layout that respects original aspect ratios. |
| **⚡ Blazing Fast** | Built on Next.js 15 for optimal performance and SEO. |
| **🔐 Secure Auth** | Google Authentication via Firebase for seamless user access. |
| **☁️ Cloudinary** | High-quality image hosting with automatic optimization & compression. |
| **📱 Mobile First** | Fully responsive design with a dedicated mobile experience. |
| **🛠️ Admin Dashboard** | Easy-to-use interface for uploading and managing photos. |
| **🏷️ EXIF Data** | Automatically extracts camera settings (ISO, Aperture, Shutter Speed). |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase Project
- A Cloudinary Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RACHIT-KUSHWAHA/SilentShutter.git
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

<div align="center">
  Made with ❤️ by <a href="https://github.com/RACHIT-KUSHWAHA">Rachit Kushwaha</a>
</div>
