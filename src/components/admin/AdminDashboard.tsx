"use client";

import { useState, useEffect } from "react";
import { Upload, Folder, Image as ImageIcon, Lock, ExternalLink } from "lucide-react";
import { PhotoEntry, CategoryEntry } from "@/types/photos";
import { UploadForm } from "./UploadForm";
import { PhotoList } from "./PhotoList";
import { CategoryManager } from "./CategoryManager";
import { useAuth } from "@/context/AuthContext";
import { getCategories, getPhotos } from "@/lib/db";

type Tab = "upload" | "library" | "folders";

export function AdminDashboard() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("upload");
    const [categories, setCategories] = useState<CategoryEntry[]>([]);
    const [photos, setPhotos] = useState<PhotoEntry[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [orphanedCount, setOrphanedCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;
            setIsLoadingData(true);
            try {
                const [userCategories, userPhotos] = await Promise.all([
                    getCategories(),
                    getPhotos(user.uid)
                ]);
                setCategories(userCategories);
                setPhotos(userPhotos);

                // Check for orphaned photos (only for the owner)
                if (user.email === "kushwaharachit80@gmail.com") {
                    const { getOrphanedPhotos } = await import("@/lib/db");
                    const orphans = await getOrphanedPhotos();
                    setOrphanedCount(orphans.length);
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setIsLoadingData(false);
            }
        }

        if (user) {
            fetchData();
        }
    }, [user, activeTab]); // Refresh when tab changes to ensure fresh data

    const handleClaimPhotos = async () => {
        if (!user) return;
        setIsLoadingData(true);
        try {
            const { claimOrphanedPhotos } = await import("@/lib/db");
            const count = await claimOrphanedPhotos(user.uid);
            alert(`Successfully claimed ${count} photos!`);
            window.location.reload(); // Reload to see changes
        } catch (error) {
            console.error("Failed to claim photos", error);
            alert("Failed to claim photos.");
        } finally {
            setIsLoadingData(false);
        }
    };

    if (loading || isLoadingData) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <Lock className="mb-4 h-12 w-12 text-white/20" />
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="text-white/60">Please sign in to access the dashboard.</p>
            </div>
        );
    }

    // Check if user has setup their keys
    // We can't easily check keys here without fetching settings, but we can check if they have photos.
    // Actually, UploadForm handles the key check.
    // Let's add a small alert if no photos are present to guide them.
    const showGuide = photos.length === 0 && activeTab === 'upload';

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0">
                <nav className="sticky top-8 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${activeTab === "upload" ? "bg-emerald-500 text-black" : "text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <Upload className="h-5 w-5" />
                        Upload
                    </button>
                    <button
                        onClick={() => setActiveTab("library")}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${activeTab === "library" ? "bg-emerald-500 text-black" : "text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <ImageIcon className="h-5 w-5" />
                        Library
                    </button>
                    <button
                        onClick={() => setActiveTab("folders")}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${activeTab === "folders" ? "bg-emerald-500 text-black" : "text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <Folder className="h-5 w-5" />
                        Folders
                    </button>

                    <div className="my-2 border-t border-white/10" />

                    <a
                        href="/"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <ExternalLink className="h-5 w-5" />
                        Go to Homepage
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {orphanedCount > 0 && (
                    <div className="mb-8 flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/10 p-6">
                        <div>
                            <h3 className="mb-1 text-lg font-bold text-blue-400">Legacy Photos Found</h3>
                            <p className="text-white/80">
                                We found {orphanedCount} photos that aren't linked to your account yet.
                            </p>
                        </div>
                        <button
                            onClick={handleClaimPhotos}
                            className="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                        >
                            Link to My Account
                        </button>
                    </div>
                )}

                {showGuide && (
                    <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                        <h3 className="mb-2 text-lg font-bold text-emerald-400">Welcome to your Dashboard!</h3>
                        <p className="text-white/80">
                            To start uploading photos, make sure you have configured your <strong>Cloudinary API Keys</strong> in Settings.
                        </p>
                    </div>
                )}
                {activeTab === "upload" && (
                    <UploadForm categories={categories} />
                )}
                {activeTab === "library" && (
                    <PhotoList photos={photos} />
                )}
                {activeTab === "folders" && (
                    <CategoryManager categories={categories} />
                )}
            </main>
        </div>
    );
}
