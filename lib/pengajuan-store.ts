import type { Pengajuan, PengajuanInsert } from "@/types/pengajuan";

/**
 * Penyimpanan sementara di localStorage karena tabel `pengajuan` di Supabase
 * belum dibuat. Hanya untuk kebutuhan demo frontend di satu browser yang sama
 * -- ganti seluruh isi file ini dengan query Supabase begitu backend siap.
 */
const STORAGE_KEY = "pengajuan-store";

function readAll(): Pengajuan[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Pengajuan[]) : [];
    } catch {
        return [];
    }
}

function writeAll(items: Pengajuan[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function savePengajuan(input: PengajuanInsert): Pengajuan {
    const now = new Date().toISOString();
    const pengajuan: Pengajuan = {
        id: crypto.randomUUID(),
        nomor_tiket: input.nomor_tiket,
        jenis_surat: input.jenis_surat,
        data: input.data,
        status: "menunggu",
        catatan_petugas: null,
        created_at: now,
        updated_at: now,
        selesai_at: null,
    };

    const items = readAll();
    items.push(pengajuan);
    writeAll(items);

    return pengajuan;
}

export function getPengajuanByTiket(nomorTiket: string): Pengajuan | undefined {
    const target = nomorTiket.trim().toLowerCase();
    return readAll().find((item) => item.nomor_tiket.toLowerCase() === target);
}
