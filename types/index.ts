export type StatusPengajuan = "menunggu" | "diproses" | "selesai" | "ditolak";

export type JenisSuratId =
    | "kelahiran"
    | "lahir-mati"
    | "kematian"
    | "sku"
    | "izin-usaha"
    | "keterangan-tidak-mampu"
    | "pindah-domisili"
    | "rekomendasi-nikah"
    | "dispensasi-nikah"
    | "pengantar-nikah";

export interface JenisSuratConfig {
    id: JenisSuratId;
    kode: string;
    nama: string;
    deskripsi: string;
    persyaratan: string[];
    estimasiHari: number;
    tersedia: boolean;
}
