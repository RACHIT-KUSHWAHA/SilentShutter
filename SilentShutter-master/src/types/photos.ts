export type PhotoCategory = string;

export interface CategoryEntry {
  id: string;
  name: string;
  slug: string;
  userId?: string;
}

export interface UserSettings {
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  username?: string;
}

export interface PhotoMeta {
  camera?: string;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutter?: string;
  location?: string;
}

// image URLs: 'url' is the high-res transformed URL; 'placeholder' is a tiny blurred preview
export interface PhotoImage {
  url: string;
  placeholder: string; // tiny blurred preview URL (Cloudinary e_blur,q_1,w_20 recommended)
  publicId?: string;
  width?: number;
  height?: number;
}

export interface PhotoEntry {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  featured?: boolean;
  capturedOn?: string;
  image: PhotoImage;
  metadata: PhotoMeta;
  userId?: string;
  initialScore?: number;
  createdAt?: string;
}
