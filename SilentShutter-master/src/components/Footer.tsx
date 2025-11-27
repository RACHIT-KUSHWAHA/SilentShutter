export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black/50 py-6 text-center text-white/30 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
                <p className="text-xs">
                    &copy; {new Date().getFullYear()} Silent Shutter. All rights reserved.
                </p>
                <div className="flex gap-6 text-[10px] uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition">Terms</a>
                    <a href="#" className="hover:text-white transition">Privacy</a>
                    <a href="#" className="hover:text-white transition">Contact</a>
                </div>
            </div>
        </footer>
    );
}
