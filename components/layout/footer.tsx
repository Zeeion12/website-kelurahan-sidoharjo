import Image from "next/image";
import Link from "next/link";
import logoKelurahan from "@/public/images/Logo Kelurahan.jpg";

const TAUTAN_CEPAT = [
    { href: "/", label: "Beranda" },
    { href: "/#layanan", label: "Ajukan Surat" },
    { href: "/status", label: "Cek Status Pengajuan" },
];

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-linear-to-b from-neutral-950 via-green-950 to-black text-white">
            <div className="h-1 w-full bg-linear-to-r from-emerald-700 via-white/80 to-emerald-700" />
            <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 text-sm text-white/70 sm:grid-cols-3">
                <div className="flex flex-col gap-3 sm:col-span-1">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-white/20">
                            <Image
                                src={logoKelurahan}
                                alt="Logo Kalurahan Sidoharjo"
                                className="size-full rounded-full object-contain"
                            />
                        </span>
                        <p className="font-heading text-base font-semibold text-white">
                            Kalurahan Sidoharjo
                        </p>
                    </div>
                    <p>
                        Pemerintah Kalurahan Sidoharjo, Kapanewon Tepus, Kabupaten
                        Gunungkidul
                    </p>
                    <p>Sidoharjo, Tepus, Gunungkidul, Kode Pos 55881</p>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="font-heading text-sm font-semibold text-white">
                        Tautan Cepat
                    </p>
                    <nav className="flex flex-col gap-2">
                        {TAUTAN_CEPAT.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors hover:text-white hover:underline"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="transition-colors hover:text-white hover:underline"
                        >
                            Login Petugas
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="font-heading text-sm font-semibold text-white">
                        Kontak
                    </p>
                    <p>Email: sidoharjotepus.1949@gmail.com</p>
                    <p className="pt-2 text-xs text-white/50">
                        Dibuat oleh Mahasiswa Informatika UII (KKN Angkatan 73)
                    </p>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto w-full max-w-5xl px-4 py-4 text-center text-xs text-white/50 sm:text-left">
                    &copy; {new Date().getFullYear()} Kalurahan Sidoharjo. Layanan surat
                    online.
                </div>
            </div>
        </footer>
    );
}
