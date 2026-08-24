import Link from "next/link";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <header className="sticky top-0 z-40 border-b border-border bg-background">
                <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
                    <Link href="/dashboard" className="flex flex-col leading-tight">
                        <span className="font-heading text-sm font-semibold sm:text-base">
                            Dashboard Petugas
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Kalurahan Sidoharjo
                        </span>
                    </Link>
                    <LogoutButton />
                </div>
            </header>
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        </div>
    );
}
