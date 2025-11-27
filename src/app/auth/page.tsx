"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithEmail, signUpWithEmail, handleRedirectResult } from "@/lib/firebase";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle Google sign-in redirect result (for mobile)
    useEffect(() => {
        const checkRedirectResult = async () => {
            setLoading(true);
            try {
                const user = await handleRedirectResult();
                if (user) {
                    router.push("/");
                }
            } catch (err: any) {
                if (err.code !== 'auth/popup-closed-by-user') {
                    setError("Failed to complete Google sign-in.");
                }
            } finally {
                setLoading(false);
            }
        };
        checkRedirectResult();
    }, [router]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const user = await signInWithGoogle();
            // For desktop popup, user will be returned immediately
            if (user) {
                router.push("/");
            }
            // For mobile redirect, user will be null and redirect will happen
        } catch (err) {
            setError("Failed to sign in with Google.");
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate password confirmation for signup
        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
            router.push("/");
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already in use.");
            } else if (err.code === 'auth/invalid-credential') {
                setError("Invalid email or password.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError("Authentication failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
            <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
                <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Gallery
                </Link>
            </div>

            <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                    <p className="mt-2 text-sm text-white/60">
                        {isLogin ? "Sign in to manage your gallery" : "Start your photography journey"}
                    </p>
                </div>

                <div className="flex gap-2 rounded-lg bg-white/5 p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 rounded-md py-2 text-sm font-medium transition ${isLogin ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 rounded-md py-2 text-sm font-medium transition ${!isLogin ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-white placeholder-white/20 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="relative">
                        <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 pr-12 text-white placeholder-white/20 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                            placeholder="••••••••"
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-white/60 hover:text-white transition"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        {!isLogin && (
                            <p className="mt-1 text-xs text-white/40">At least 6 characters</p>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="relative">
                            <label className="mb-1.5 block text-xs font-medium text-white/60">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 pr-12 text-white placeholder-white/20 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                                placeholder="••••••••"
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-9 text-white/60 hover:text-white transition"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-white py-2.5 font-bold text-black transition hover:bg-gray-200 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-white/40">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 font-medium transition hover:bg-white/10 disabled:opacity-50"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="##EA4335"
                        />
                    </svg>
                    Google
                </button>
            </div>
        </div>
    );
}
