export type StatusPengajuan = "menunggu" | "diproses" | "selesai" | "ditolak";

export type JenisSuratId =
    | "kelahiran"
    | "lahir-mati"
    | "kematian"
    | "sku"
    | "keterangan-tidak-mampu"
    | "pindah-domisili"
    | "rekomendasi-nikah"
    | "dispensasi-nikah"
    | "pengantar-nikah"
    | "perubahan-elemen-data"
    | "peristiwa-kependudukan"
    | "biodata-keluarga";

export interface JenisSuratConfig {
    id: JenisSuratId;
    kode: string;
    nama: string;
    deskripsi: string;
    persyaratan: string[];
    estimasiHari: number;
    tersedia: boolean;
    /** "dukcapil" = formulir resmi Dukcapil, bukan surat kalurahan (tidak berkop
     * kalurahan, Lurah tidak menandatangani). Default kalurahan kalau kosong. */
    instansi?: "kalurahan" | "dukcapil";
}
