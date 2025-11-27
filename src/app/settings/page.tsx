"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { UserSettings } from "@/types/photos";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<UserSettings>({
        cloudinaryCloudName: "",
        cloudinaryUploadPreset: "",
        username: "",
    });

    useEffect(() => {
        async function fetchSettings() {
            if (!user || !firestore) return;
            try {
                const docRef = doc(firestore, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserSettings;
                    setSettings({
                        cloudinaryCloudName: data.cloudinaryCloudName || "",
                        cloudinaryUploadPreset: data.cloudinaryUploadPreset || "",
                        username: data.username || "",
                    });
                } else if (user.email === "kushwaharachit80@gmail.com") {
                    // Pre-fill for owner if no settings exist
                    setSettings({
                        cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
                        cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
                        username: "",
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchSettings();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore) return;

        setSaving(true);
        try {
            // TODO: Check for username uniqueness if changed
            await setDoc(doc(firestore, "users", user.uid), settings, { merge: true });
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="mt-2 text-white/60">Please sign in to access settings.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-6 py-12">
            <h1 className="mb-8 text-3xl font-bold text-white">Settings</h1>

            {/* Public Profile Setup */}
            <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-8 backdrop-blur-sm">
                <h2 className="mb-4 text-xl font-bold text-blue-400">Public Profile Setup</h2>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-white/80">
                        Username (for your custom URL)
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-3 text-white/40">silentshutter.com/</span>
                            <input
                                type="text"
                                value={settings.username || ""}
                                onChange={(e) => setSettings({ ...settings, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                                className="w-full rounded-xl border border-white/10 bg-black/50 pl-[160px] pr-4 py-3 text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="your-username"
                            />
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-white/40">
                        This will be your public gallery URL. Only letters, numbers, and hyphens.
                    </p>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">Your User ID (UID)</label>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg bg-black/50 px-4 py-3 text-sm font-mono text-white">{user.uid}</code>
                        <button
                            onClick={() => navigator.clipboard.writeText(user.uid)}
                            className="rounded-lg bg-white/10 px-4 py-3 font-bold text-white hover:bg-white/20"
                        >
                            Copy
                        </button>
                    </div>
                </div>
                <p className="text-xs text-white/60">
                    Add this to your <code>.env.local</code> file:<br />
                    <code>NEXT_PUBLIC_OWNER_ID={user.uid}</code>
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-white">Cloudinary Configuration</h2>

                <div className="mb-8 space-y-4 text-sm text-white/60">
                    <p>
                        To upload your own photos, you need to provide your Cloudinary credentials.
                        We use these keys to upload images directly to your cloud storage.
                    </p>
                    <div className="rounded-xl bg-white/5 p-4">
                        <h3 className="mb-2 font-bold text-white">Why do I need this?</h3>
                        <p>
                            Silent Shutter is a multi-user platform where each photographer owns their data.
                            By using your own Cloudinary account, you have full control over your images and storage limits.
                        </p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                        <h3 className="mb-2 font-bold text-white">What about Firebase keys?</h3>
                        <p>
                            You <strong>do not</strong> need to provide Firebase keys. The application handles authentication and database connections for you using the shared platform configuration.
                        </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <h3 className="mb-2 font-bold text-emerald-400">How to get Cloudinary Keys?</h3>
                        <ol className="list-decimal space-y-2 pl-4 text-white/80">
                            <li>Create a free account at <a href="https://cloudinary.com" target="_blank" className="text-emerald-400 underline">cloudinary.com</a>.</li>
                            <li>Go to your <strong>Dashboard</strong> to find your <strong>Cloud Name</strong>.</li>
                            <li>Go to <strong>Settings (gear icon) &gt; Upload</strong>.</li>
                            <li>Scroll down to <strong>Upload presets</strong> and click <strong>Add upload preset</strong>.</li>
                            <li><strong>Name</strong>: Give it a name (e.g., <code>silent-shutter</code>).</li>
                            <li><strong>Signing Mode</strong>: Select <strong>Unsigned</strong> (Crucial!).</li>
                            <li>Click <strong>Save</strong> and copy the name.</li>
                        </ol>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Cloud Name
                        </label>
                        <input
                            type="text"
                            value={settings.cloudinaryCloudName}
                            onChange={(e) => setSettings({ ...settings, cloudinaryCloudName: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="e.g. dxy8..."
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Upload Preset
                        </label>
                        <input
                            type="text"
                            value={settings.cloudinaryUploadPreset}
                            onChange={(e) => setSettings({ ...settings, cloudinaryUploadPreset: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="e.g. silent_shutter_unsigned"
                            required
                        />
                        <p className="mt-2 text-xs text-white/40">
                            Make sure this is an <strong>Unsigned</strong> upload preset.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
