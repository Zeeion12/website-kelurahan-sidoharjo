import { getJenisSuratById } from "@/config/jenis-surat";
import type { JenisSuratId } from "@/types";

/**
 * Nomor tiket sementara di sisi klien (belum ada penomoran urut dari Supabase
 * karena tabel `pengajuan` belum dibuat). Format: KODE-YYMMDD-XXXX.
 * Ganti dengan nomor urut dari database begitu backend-nya siap.
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
