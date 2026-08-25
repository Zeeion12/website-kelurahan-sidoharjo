import type { JenisSuratConfig, JenisSuratId } from "@/types";

export const JENIS_SURAT: JenisSuratConfig[] = [
    {
        id: "kelahiran",
        kode: "KLH",
        nama: "Surat Keterangan Kelahiran",
        deskripsi: "Pelaporan kelahiran anak untuk pencatatan sipil (formulir F-2.01).",
        persyaratan: [
            "Kartu Keluarga orang tua",
            "KTP ayah dan ibu",
            "Buku nikah / kutipan akta perkawinan",
            "Surat keterangan lahir dari bidan/RS",
        ],
        estimasiHari: 3,
        tersedia: true,
    },
    {
        id: "lahir-mati",
        kode: "LHM",
        nama: "Surat Keterangan Lahir Mati",
        deskripsi: "Pelaporan kelahiran bayi dalam keadaan meninggal (formulir F-2.01).",
        persyaratan: [
            "Kartu Keluarga orang tua",
            "KTP ayah dan ibu",
            "Surat keterangan lahir mati dari bidan/RS",
        ],
        estimasiHari: 3,
        tersedia: true,
    },
    {
        id: "kematian",
        kode: "KTN",
        nama: "Surat Keterangan Kematian",
        deskripsi: "Pelaporan kematian warga untuk pencatatan sipil (formulir F-2.01).",
        persyaratan: [
            "KTP dan KK almarhum/almarhumah",
            "Surat keterangan kematian dari fasilitas kesehatan (jika ada)",
            "KTP pelapor",
        ],
        estimasiHari: 2,
        tersedia: true,
    },
    {
        id: "sku",
        kode: "SKU",
        nama: "Surat Keterangan Usaha",
        deskripsi: "Keterangan bahwa warga benar memiliki usaha di wilayah Kalurahan Sidoharjo.",
        persyaratan: ["KTP pemohon", "Kartu Keluarga pemohon"],
        estimasiHari: 2,
        tersedia: true,
    },
    {
        id: "keterangan-tidak-mampu",
        kode: "SKTM",
        nama: "Surat Keterangan Tidak Mampu",
        deskripsi:
            "Keterangan kondisi ekonomi kurang mampu, umumnya untuk keperluan pendidikan/beasiswa.",
        persyaratan: [
            "KTP orang tua/wali",
            "Kartu Keluarga",
            "Data anak (untuk keperluan sekolah/kuliah)",
        ],
        estimasiHari: 2,
        tersedia: true,
    },
    {
        id: "izin-usaha",
        kode: "SIU",
        nama: "Surat Izin Usaha",
        deskripsi:
            "Belum tersedia — Kalurahan tidak menerbitkan izin usaha (ranah OSS/DPMPT). Kemungkinan besar sama dengan Surat Keterangan Usaha; menunggu konfirmasi Kelurahan.",
        persyaratan: [],
        estimasiHari: 0,
        tersedia: false,
    },
    {
        id: "pindah-domisili",
        kode: "SKPD",
        nama: "Surat Keterangan Pindah Domisili",
        deskripsi:
            "Formulir F-1.03 Dukcapil. Isi datanya di sini untuk dicetak dan dibawa ke Dukcapil — penanda tangan resminya Kepala Dinas Dukcapil, bukan Lurah.",
        persyaratan: ["Kartu Keluarga", "KTP pemohon", "Data anggota keluarga yang ikut pindah"],
        estimasiHari: 1,
        tersedia: true,
    },
];

export function getJenisSuratById(id: JenisSuratId): JenisSuratConfig | undefined {
    return JENIS_SURAT.find((jenis) => jenis.id === id);
}
