import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/update-session";
import { isRateLimited } from "@/lib/rate-limit";

const CEK_STATUS_LIMIT = 10;
const CEK_STATUS_WINDOW_MS = 60_000;

function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}

// Hanya membatasi percobaan cek status (request dengan ?tiket=...), bukan
// sekadar membuka halaman /status -- supaya brute-force nebak nomor tiket
// tidak bisa dicoba ratusan kali per menit dari IP yang sama. Kalau kena
// limit, redirect balik ke /status dengan flag `dibatasi` supaya halaman
// tetap tampil normal (bukan halaman teks polos di luar UI situs).
function cekStatusRateLimit(request: NextRequest): NextResponse | null {
    const tiket = request.nextUrl.searchParams.get("tiket");
    if (!tiket) return null;

    const ip = getClientIp(request);
    if (isRateLimited(`cek-status:${ip}`, CEK_STATUS_LIMIT, CEK_STATUS_WINDOW_MS)) {
        const url = request.nextUrl.clone();
        url.searchParams.delete("tiket");
        url.searchParams.set("dibatasi", "1");
        return NextResponse.redirect(url, { status: 303 });
    }

    return null;
}

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === "/status") {
        return cekStatusRateLimit(request) ?? NextResponse.next();
    }

    return await updateSession(request);
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/status"],
};
