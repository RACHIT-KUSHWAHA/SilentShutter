import { PhotoEntry, PhotoCategory } from "@/types/photos";





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
