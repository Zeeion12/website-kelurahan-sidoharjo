import { getJenisSuratById } from "@/config/jenis-surat";
import type { JenisSuratId } from "@/types";

/**
 * Format: KODE-YYMMDD-XXXX. Dibuat di sisi klien lalu diinsert ke Supabase;
 * kalau kebetulan bentrok dengan tiket lain (constraint unique), pemanggil
 * (lib/pengajuan-client.ts) akan memanggil ini lagi untuk dapat nomor baru.
 */
export function generateNomorTiket(jenisSurat: JenisSuratId): string {
    const kode = getJenisSuratById(jenisSurat)?.kode ?? "SRT";
    const now = new Date();
    const tanggal = [now.getFullYear() % 100, now.getMonth() + 1, now.getDate()]
        .map((n) => String(n).padStart(2, "0"))
        .join("");
    const acak = Math.floor(1000 + Math.random() * 9000);

    return `${kode}-${tanggal}-${acak}`;
}
