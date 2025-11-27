"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface RatingButtonProps {
    photoId: string;
    initialScore?: number;
}

export function RatingButton({ photoId, initialScore = 0 }: RatingButtonProps) {
    const [score, setScore] = useState(initialScore);
    const [hasRated, setHasRated] = useState(false);

    const handleRate = () => {
        if (hasRated) return;
        setScore((prev) => prev + 1);
        setHasRated(true);
        // TODO: Implement actual API call to save rating
        console.log(`Rated photo ${photoId}`);
    };

    return (
        <button
            onClick={handleRate}
            disabled={hasRated}
            className={`group flex items-center gap-2 rounded-full px-4 py-2 transition-all ${hasRated
                    ? "bg-red-500/10 text-red-500"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
        >
            <Heart
                className={`h-5 w-5 transition-transform ${hasRated ? "fill-current" : "group-hover:scale-110"
                    }`}
            />
            <span className="font-medium">{score}</span>
        </button>
    );
}
