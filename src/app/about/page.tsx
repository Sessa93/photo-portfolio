import Link from "next/link";

export const metadata = {
    title: "About Me — Andrea Sessa",
    description: "Software developer, photographer, and lover of film photography.",
};

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-[#0c0c0c]">
            {/* Header */}
            <header className="w-full max-w-3xl px-6 pt-24 text-center sm:px-8 sm:pt-32"
                    style={{marginBottom: "20px", marginTop: "30px"}}>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium italic tracking-wide text-white sm:text-5xl">
                    About Me
                </h1>
            </header>

            {/* Separator */}
            <div className="w-full max-w-3xl px-6 sm:px-8" style={{marginBottom: "30px"}}>
                <div className="h-px bg-neutral-800/60"/>
            </div>

            {/* Content */}
            <section className="w-full max-w-3xl px-6 pb-16 sm:px-8">
                <div className="space-y-6 text-base leading-relaxed text-neutral-300">
                    <p>
                        Hi, I'm <span className="text-white font-medium">Andrea Sessa</span> — a software
                        developer by trade and a photographer at heart. I spend my days writing code and my
                        free time chasing light, texture, and the quiet beauty in everyday scenes.
                    </p>

                    <p>
                        My love for photography began with film. There's something irreplaceable about the
                        deliberate pace of loading a roll, the anticipation of waiting for developed frames,
                        and the organic warmth that only analog emulsions can deliver. Film taught me to slow
                        down, to be intentional with every frame, and to trust the process rather than the
                        screen.
                    </p>

                    <p>
                        That mindset carries over into everything I do — whether I'm composing a photograph
                        or architecting software. I value simplicity, attention to detail, and the kind of
                        craft that reveals itself quietly over time.
                    </p>

                    <p>
                        This portfolio is a curated window into the moments that move me: fleeting light,
                        striking textures, and the stories hidden in ordinary places. I hope you enjoy
                        exploring them as much as I enjoyed capturing them.
                    </p>

                    <p className="text-neutral-500 text-sm italic">
                        Shot on both digital and film — because the best camera is the one that makes you see.
                    </p>
                </div>
            </section>

            {/* Separator */}
            <div className="w-full max-w-3xl px-6 sm:px-8" style={{marginTop: "10px", marginBottom: "10px"}}>
                <div className="h-px bg-neutral-800/60"/>
            </div>

            {/* Back link */}
            <div className="w-full max-w-3xl px-6 py-12 text-center sm:px-8"
                 style={{marginBottom: "30px"}}>
                <Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white">
                    ← Back to gallery
                </Link>
            </div>
        </main>
    );
}
