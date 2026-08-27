"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logoKelurahan from "@/public/images/Logo Kelurahan.jpg";

const NAV_LINKS = [
    { href: "/", label: "Beranda" },
    { href: "/#layanan", label: "Ajukan Surat" },
    { href: "/status", label: "Cek Status" },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-linear-to-r from-emerald-950 via-green-900 to-neutral-950 shadow-md">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
                <Link
                    href="/"
                    className="flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-black/10 sm:size-11">
                        <Image
                            src={logoKelurahan}
                            alt="Logo Kalurahan Sidoharjo"
                            className="size-full rounded-full object-contain"
                            priority
                        />
                    </span>
                    <span className="flex flex-col leading-tight">
                        <span className="font-heading text-sm font-semibold text-white sm:text-base">
                            Layanan Surat Online
                        </span>
                        <span className="text-xs text-white/70">
                            Kalurahan Sidoharjo, Tepus
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white/80 transition-colors hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 sm:hidden"
                >
                    {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {isMenuOpen && (
                <nav className="flex flex-col gap-1 border-t border-white/10 bg-neutral-950/95 px-4 py-3 text-sm font-medium sm:hidden">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-md px-2 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
