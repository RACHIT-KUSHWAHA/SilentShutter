"use server";

import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  const password = formData.get("password") as string;
  const file = formData.get("file") as File;
  const folder = formData.get("category") as string || "uploads";

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }

  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `silent-shutter/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      placeholder: await generatePlaceholder(result.public_id),
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return { error: "Upload failed" };
  }
}

async function generatePlaceholder(publicId: string) {
    // Generate a tiny blurred version URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_1,w_20,e_blur:1000/${publicId}`;
}
