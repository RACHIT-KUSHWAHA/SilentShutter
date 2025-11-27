import { HomeGallery } from "@/components/HomeGallery";
import { getUserByUsername } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        username: string;
    };
}

export default async function UserProfilePage({ params }: PageProps) {
    const { username } = params;

    // Resolve username to userId
    const user = await getUserByUsername(username);

    if (!user) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <HomeGallery initialUserId={user.uid} />
        </main>
    );
}
