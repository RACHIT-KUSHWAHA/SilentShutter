"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPhotos, getCategories } from "@/lib/db";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PhotoEntry, CategoryEntry } from "@/types/photos";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function HomeGallery({ initialUserId }: { initialUserId?: string }) {
    const { user, loading: authLoading } = useAuth();
    const [photos, setPhotos] = useState<PhotoEntry[]>([]);
    const [categories, setCategories] = useState<CategoryEntry[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoadingData(true);
            try {
                // Priority:
                // 1. initialUserId (if viewing a specific profile)
                // 2. user.uid (if logged in and on home page)
                // 3. undefined (will use NEXT_PUBLIC_OWNER_ID for public gallery)

                const targetUserId = initialUserId || user?.uid;

                const [fetchedPhotos, fetchedCategories] = await Promise.all([
                    getPhotos(targetUserId),
                    getCategories()
                ]);

                setPhotos(fetchedPhotos);
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoadingData(false);
            }
        }

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading, initialUserId]);

    if (loadingData) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    // If no photos found (e.g. new user), show empty state only if logged in AND viewing own profile (or generic empty)
    // If viewing someone else's profile and it's empty, show "No photos yet"
    if (photos.length === 0) {
        if (user && (!initialUserId || initialUserId === user.uid)) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-white/60">Your gallery is empty.</p>
                    <Link href="/admin" className="mt-4 text-emerald-400 hover:text-emerald-300">
                        Go to Dashboard to upload photos
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-white/60">No photos found.</p>
                </div>
            );
        }
    }

    return <GalleryGrid photos={photos} categories={categories} />;
}
