import Link from "next/link";

const NAV_LINKS = [
    { href: "/", label: "Beranda" },
    { href: "/#layanan", label: "Ajukan Surat" },
    { href: "/status", label: "Cek Status" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
                <Link href="/" className="flex flex-col leading-tight">
                    <span className="font-heading text-sm font-semibold sm:text-base">
                        Layanan Surat Online
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Kalurahan Sidoharjo, Tepus
                    </span>
                </Link>
                <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
