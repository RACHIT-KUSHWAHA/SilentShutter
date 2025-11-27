"use client";

import { useState } from "react";
import { addCategoryToDb, deleteCategoryFromDb } from "@/lib/db";
import { CategoryEntry } from "@/types/photos";
import { Loader2, Plus, Trash2, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function CategoryManager({
    categories
}: {
    categories: CategoryEntry[]
}) {
    const { user } = useAuth();
    const [newCategory, setNewCategory] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim() || !user) return;

        setIsAdding(true);
        // We need to update addCategory to accept userId instead of password
        // Or just use the db function directly since we are on client and have auth
        try {
            await addCategoryToDb(newCategory, user.uid);
            setNewCategory("");
        } catch (error) {
            console.error("Failed to add category", error);
        }
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This won't delete the photos, but they will lose this category.")) return;
        setIsDeleting(id);
        try {
            await deleteCategoryFromDb(id);
        } catch (error) {
            console.error("Failed to delete category", error);
        }
        setIsDeleting(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Folders</h2>
                <span className="text-sm text-white/50">{categories.length} Total</span>
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Folder Name..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={isAdding || !newCategory.trim()}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black disabled:opacity-50 hover:bg-emerald-400"
                >
                    {isAdding ? <Loader2 className="animate-spin" /> : <Plus />}
                    Add
                </button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Folder className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">{cat.name}</h3>
                                <p className="text-xs text-white/40">/{cat.slug}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={isDeleting === cat.id}
                            className="rounded-lg p-2 text-white/20 transition hover:bg-red-500/10 hover:text-red-500"
                        >
                            {isDeleting === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
