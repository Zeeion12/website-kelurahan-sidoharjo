import type { JenisSuratId, StatusPengajuan } from "@/types";

export interface Pengajuan {
    id: string;
    nomor_tiket: string;
    jenis_surat: JenisSuratId;
    data: Record<string, unknown>;
    status: StatusPengajuan;
    catatan_petugas: string | null;
    created_at: string;
    updated_at: string;
    selesai_at: string | null;
}

export interface PengajuanInput {
    jenisSurat: JenisSuratId;
    data: Record<string, unknown>;
}

/** Bentuk yang dibalikkan fungsi RPC `cek_status_pengajuan` -- tanpa `id`/`data` pribadi. */
export interface PengajuanStatusPublik {
    nomor_tiket: string;
    jenis_surat: JenisSuratId;
    status: StatusPengajuan;
    catatan_petugas: string | null;
    created_at: string;
    selesai_at: string | null;
}
