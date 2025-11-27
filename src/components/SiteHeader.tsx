"use client";

import { useState } from "react";
import { Aperture, User, ShieldCheck, ExternalLink, Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/5 bg-transparent backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                            <Aperture className="h-6 w-6 text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Silent Shutter</span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="flex items-center gap-4">
                        {!user && (
                            <Link
                                href="/auth"
                                className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-200 sm:block"
                            >
                                Create Your Own Gallery
                            </Link>
                        )}
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            {user ? (
                                // Show user avatar if available, else default user icon
                                user.photoURL ? (
                                    <img src={user.photoURL} alt="User" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Profile Modal */}
            <AnimatePresence>
                {isProfileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProfileOpen(false)}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl">
                                {/* Admin Button (Top Right) */}
                                <Link
                                    href="/admin"
                                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-emerald-500/20 hover:text-emerald-400"
                                    title="Admin Access"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                </Link>

                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/20 overflow-hidden">
                                        {user?.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-black" />
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold text-white">{user ? (user.displayName || user.email) : "Rachit Kushwaha"}</h2>
                                    <p className="text-emerald-400 font-medium">{user ? "Photographer" : "@BeyondRachit"}</p>

                                    {!user && (
                                        <p className="mt-2 text-white/60">
                                            YouTube Thumbnail Designer based in Meerut, UP, India.
                                        </p>
                                    )}

                                    {user ? (
                                        <div className="mt-8 flex flex-col gap-3 w-full">
                                            <Link href="/admin" className="w-full rounded-xl bg-white text-black py-3 font-bold hover:bg-gray-200 transition">
                                                Go to Dashboard
                                            </Link>
                                            <Link href="/settings" className="w-full rounded-xl border border-white/10 bg-transparent py-3 font-bold text-white hover:bg-white/5 transition">
                                                Settings
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="mt-8 flex gap-4">
                                            <a href="https://www.instagram.com/beyondrachit" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:scale-110">
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                            <a href="https://twitter.com/BeyondRachit" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:scale-110">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                            <a href="https://github.com/Rachit-0P" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:scale-110">
                                                <Github className="h-5 w-5" />
                                            </a>
                                            <a href="https://beyondrachit.com" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:scale-110">
                                                <ExternalLink className="h-5 w-5" />
                                            </a>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setIsProfileOpen(false)}
                                        className="mt-4 w-full rounded-xl border border-white/10 bg-transparent py-3 font-bold text-white/60 hover:bg-white/5 hover:text-white transition"
                                    >
                                        Close
                                    </button>

                                    {user && (
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="mt-2 w-full text-sm text-red-400 hover:text-red-300 transition"
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
