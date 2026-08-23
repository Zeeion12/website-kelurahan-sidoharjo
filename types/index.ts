export type StatusPengajuan = "menunggu" | "diproses" | "selesai" | "ditolak";

export type JenisSuratId =
    | "kelahiran"
    | "lahir-mati"
    | "kematian"
    | "sku"
    | "izin-usaha"
    | "keterangan-tidak-mampu"
    | "pindah-domisili";

export interface JenisSuratConfig {
    id: JenisSuratId;
    nama: string;
    deskripsi: string;
    persyaratan: string[];
    estimasiHari: number;
    tersedia: boolean;
}
