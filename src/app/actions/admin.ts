"use server";

import { v2 as cloudinary } from "cloudinary";
import { addCategoryToDb, deleteCategoryFromDb } from "@/lib/db";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const checkAuth = (password: string) => {
    if (password !== process.env.ADMIN_PASSWORD) {
        throw new Error("Unauthorized");
    }
};

export async function deletePhoto(id: string, publicId: string, password: string) {
    try {
        checkAuth(password);

        // 1. Delete from Cloudinary
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }

        // 2. Delete from Firestore
        if (firestore) {
            await deleteDoc(doc(firestore, "photos", id));
        }

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Delete failed:", error);
        return { error: error.message };
    }
}

export async function addCategory(name: string, password: string) {
    try {
        checkAuth(password);
        await addCategoryToDb(name);
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteCategory(id: string, password: string) {
    try {
        checkAuth(password);
        await deleteCategoryFromDb(id);
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updatePhoto(id: string, data: any, password: string) {
    try {
        checkAuth(password);
        if (!firestore) throw new Error("Database not connected");

        await updateDoc(doc(firestore, "photos", id), data);
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
