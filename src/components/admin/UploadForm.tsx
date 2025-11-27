"use client";

import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { CategoryEntry, UserSettings } from "@/types/photos";
import { Loader2, Upload, CheckCircle, XCircle, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserSettings } from "@/lib/db";
import Link from "next/link";
import exifr from 'exifr';
import imageCompression from 'browser-image-compression';

export function UploadForm({
    categories
}: {
    categories: CategoryEntry[]
}) {
    const { user } = useAuth();
    const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const router = useRouter();

    // Metadata state
    const [metadata, setMetadata] = useState({
        camera: "",
        lens: "",
        iso: "",
        aperture: "",
        shutter: "",
        location: "",
        capturedOn: "",
        title: "",
    });

    useEffect(() => {
        async function loadSettings() {
            if (!user) return;
            const settings = await getUserSettings(user.uid);

            // If user is the owner (Rachit) and no settings found, use env vars
            if ((!settings?.cloudinaryCloudName || !settings?.cloudinaryUploadPreset) &&
                (user.email === "kushwaharachit80@gmail.com")) {
                setUserSettings({
                    cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
                    cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
                });
            } else {
                setUserSettings(settings);
            }
            setLoadingSettings(false);
        }
        loadSettings();
    }, [user]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Parse EXIF
            const exif = await exifr.parse(file);
            console.log("EXIF Data:", exif);

            if (exif) {
                // Format Date
                let dateStr = "";
                if (exif.DateTimeOriginal) {
                    dateStr = new Date(exif.DateTimeOriginal).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                }

                // Format Shutter Speed (often in seconds like 0.005)
                let shutterStr = "";
                if (exif.ExposureTime) {
                    shutterStr = exif.ExposureTime >= 1 ? `${exif.ExposureTime}s` : `1/${Math.round(1 / exif.ExposureTime)}`;
                }

                setMetadata(prev => ({
                    ...prev,
                    camera: `${exif.Make || ''} ${exif.Model || ''}`.trim(),
                    lens: exif.LensModel || "",
                    iso: exif.ISO ? String(exif.ISO) : "",
                    aperture: exif.FNumber ? `f/${exif.FNumber}` : "",
                    shutter: shutterStr,
                    capturedOn: dateStr,
                    // Try to guess title from filename if empty
                    title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
                }));
            }
        } catch (error) {
            console.error("Error parsing EXIF:", error);
        }
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !userSettings?.cloudinaryCloudName || !userSettings?.cloudinaryUploadPreset) {
            setStatus("error");
            setMessage("Missing Cloudinary settings. Please configure them in Settings.");
            return;
        }

        setStatus("uploading");
        setMessage("");

        const formData = new FormData(e.currentTarget);
        let file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const folder = formData.get("category") as string || "uploads";

        try {
            // Compress image if larger than 1MB
            if (file.size > 1024 * 1024) {
                console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: file.type as string
                };
                try {
                    const compressedFile = await imageCompression(file, options);
                    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
                    file = compressedFile;
                } catch (error) {
                    console.error("Compression failed:", error);
                    // Continue with original file if compression fails, though it might fail upload
                }
            }

            // 1. Upload Image to Cloudinary (Client-side)
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("upload_preset", userSettings.cloudinaryUploadPreset);
            uploadFormData.append("folder", `silent-shutter/${folder}`);

            const cloudName = userSettings.cloudinaryCloudName;
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: uploadFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const result = await response.json();

            setStatus("saving");

            // 2. Save Metadata to Firestore
            if (!firestore) throw new Error("Database not connected");

            // Generate placeholder (simple blur URL for now, or use result.eager if configured)
            // We'll use a simple transformation URL for placeholder
            const placeholderUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_1,w_20,e_blur:1000/${result.public_id}`;

            const photoData = {
                id: slug,
                slug,
                title,
                description: formData.get("description"),
                category: formData.get("category"),
                capturedOn: formData.get("capturedOn"),
                image: {
                    url: result.secure_url,
                    placeholder: placeholderUrl,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                },
                metadata: {
                    camera: formData.get("camera"),
                    lens: formData.get("lens"),
                    iso: Number(formData.get("iso")) || 0,
                    aperture: formData.get("aperture"),
                    shutter: formData.get("shutter"),
                    location: formData.get("location"),
                },
                userId: user.uid, // Associate with user
                initialScore: 0,
                featured: false,
                createdAt: new Date().toISOString(),
            };

            await setDoc(doc(firestore, "photos", slug), photoData);

            setStatus("success");
            setMessage("Photo uploaded successfully!");

            // Reset form
            (e.target as HTMLFormElement).reset();
            setMetadata({
                camera: "",
                lens: "",
                iso: "",
                aperture: "",
                shutter: "",
                location: "",
                capturedOn: "",
                title: "",
            });

            // Refresh home page data
            router.refresh();

        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setMessage(error.message || "Something went wrong");
        }
    };

    if (loadingSettings) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (!userSettings?.cloudinaryCloudName || !userSettings?.cloudinaryUploadPreset) {
        return (
            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-8 text-center">
                <Settings className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
                <h2 className="mb-2 text-xl font-bold text-white">Setup Required</h2>
                <p className="mb-6 text-white/60">
                    You need to configure your Cloudinary keys before you can upload photos.
                </p>
                <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400"
                >
                    <Settings className="h-5 w-5" />
                    Go to Settings
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Upload New Shot</h1>
                <p className="text-white/60">Add a new photo to your gallery.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">

                {/* File Selection */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Photo</label>
                    <div className="relative">
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-400 hover:file:bg-emerald-500/20 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={metadata.title}
                            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50">Category</label>
                        <select name="category" className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none">
                            {categories.map(c => (
                                <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Description</label>
                    <textarea name="description" rows={3} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white/80">Technical Specs</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <input type="text" name="camera" value={metadata.camera} onChange={(e) => setMetadata({ ...metadata, camera: e.target.value })} placeholder="Camera (e.g. Sony A7III)" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                        <input type="text" name="lens" value={metadata.lens} onChange={(e) => setMetadata({ ...metadata, lens: e.target.value })} placeholder="Lens (e.g. 35mm f/1.4)" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                        <input type="text" name="iso" value={metadata.iso} onChange={(e) => setMetadata({ ...metadata, iso: e.target.value })} placeholder="ISO (e.g. 400)" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                        <input type="text" name="aperture" value={metadata.aperture} onChange={(e) => setMetadata({ ...metadata, aperture: e.target.value })} placeholder="Aperture (e.g. f/2.8)" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                        <input type="text" name="shutter" value={metadata.shutter} onChange={(e) => setMetadata({ ...metadata, shutter: e.target.value })} placeholder="Shutter (e.g. 1/200)" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                        <input type="text" name="location" value={metadata.location} onChange={(e) => setMetadata({ ...metadata, location: e.target.value })} placeholder="Location" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                        <input type="text" name="capturedOn" value={metadata.capturedOn} onChange={(e) => setMetadata({ ...metadata, capturedOn: e.target.value })} placeholder="Date (e.g. Nov 2025)" className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === "uploading" || status === "saving"}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold transition ${status === "success"
                        ? "bg-emerald-500 text-black"
                        : status === "error"
                            ? "bg-red-500 text-white"
                            : "bg-white text-black hover:bg-emerald-400"
                        }`}
                >
                    {status === "uploading" && <><Loader2 className="animate-spin" /> Uploading Image...</>}
                    {status === "saving" && <><Loader2 className="animate-spin" /> Saving Data...</>}
                    {status === "success" && <><CheckCircle /> Upload Complete</>}
                    {status === "error" && <><XCircle /> Error: {message}</>}
                    {status === "idle" && <><Upload className="h-5 w-5" /> Upload Shot</>}
                </button>
            </form>
        </div>
    );
}
