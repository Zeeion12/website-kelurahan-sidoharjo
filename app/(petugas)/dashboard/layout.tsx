import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/dashboard/logout-button";
import logoKelurahan from "@/public/images/Logo Kelurahan.jpg";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
    return (
        <div className="flex min-h-screen flex-col bg-linear-to-b from-green-50 via-white to-white">
            <header className="sticky top-0 z-40 border-b border-green-900/10 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/75">
                <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-green-900/10 sm:size-11">
                            <Image
                                src={logoKelurahan}
                                alt="Logo Kalurahan Sidoharjo"
                                className="size-full rounded-full object-contain"
                                priority
                            />
                        </span>
                        <span className="flex flex-col leading-tight">
                            <span className="font-heading text-sm font-semibold sm:text-base">
                                Dashboard Petugas
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Kalurahan Sidoharjo
                            </span>
                        </span>
                    </Link>
                    <LogoutButton />
                </div>
            </header>
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        </div>
    );
}
