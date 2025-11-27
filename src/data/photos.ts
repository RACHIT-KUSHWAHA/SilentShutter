import { PhotoEntry, PhotoCategory } from "@/types/photos";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Helper to toggle between Cloudinary (if you have your own images) and Unsplash (for demo)
const getImageUrl = (path: string, unsplashId: string, width = 1600) => {
  if (cloudName && !path.includes("unsplash")) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${path}`;
  }
  return `https://images.unsplash.com/photo-${unsplashId}?auto=format&fit=crop&w=${width}&q=80`;
};

const getPlaceholder = (path: string, unsplashId: string) => {
  if (cloudName && !path.includes("unsplash")) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_1,w_20,e_blur:1000/${path}`;
  }
  return `https://images.unsplash.com/photo-${unsplashId}?auto=format&fit=crop&w=20&blur=10`;
};

export const categories: PhotoCategory[] = [
  "street",
  "nature",
  "portrait",
  "documentary",
  "personal",
];

export const photoCollection: PhotoEntry[] = [];

export const featuredPhoto = photoCollection.find((photo) => photo.featured) ?? photoCollection[0];

export const latestStories = photoCollection.slice(0, 3);
