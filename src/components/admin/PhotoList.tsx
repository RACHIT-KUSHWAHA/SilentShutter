"use client";

import { useState } from "react";
import { deletePhotoFromDb } from "@/lib/db";
import { PhotoEntry } from "@/types/photos";
import { Loader2, Trash2, Calendar, Folder } from "lucide-react";
import Image from "next/image";

export function PhotoList({
    photos
}: {
    photos: PhotoEntry[]
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (photo: PhotoEntry) => {
        if (!confirm(`Delete "${photo.title}"? This cannot be undone.`)) return;

        setDeletingId(photo.id);

        try {
            await deletePhotoFromDb(photo.id);
        } catch (error) {
            console.error("Failed to delete photo", error);
        }

        setDeletingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Library</h2>
                <span className="text-sm text-white/50">{photos.length} Shots</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-white/20"
                    >
                        <div className="aspect-[3/2] relative">
                            <Image
                                src={photo.image.url}
                                alt={photo.title}
                                fill
                                className="object-cover transition group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                                <button
                                    onClick={() => handleDelete(photo)}
                                    disabled={deletingId === photo.id}
                                    className="rounded-full bg-red-500/20 p-2 text-red-400 backdrop-blur-md transition hover:bg-red-500 hover:text-white"
                                >
                                    {deletingId === photo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="truncate font-bold text-white">{photo.title}</h3>
                            <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                    <Folder className="h-3 w-3" />
                                    {photo.category}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {photo.capturedOn}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
