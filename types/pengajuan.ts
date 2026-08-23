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

export type PengajuanInsert = Pick<Pengajuan, "jenis_surat" | "data" | "nomor_tiket">;
