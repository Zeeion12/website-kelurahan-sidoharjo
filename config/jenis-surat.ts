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
        id: "pindah-domisili",
        kode: "SKPD",
        nama: "Surat Keterangan Pindah Domisili",
        deskripsi:
            "Formulir F-1.03 Dukcapil. Isi datanya di sini untuk dicetak dan dibawa ke Dukcapil — penanda tangan resminya Kepala Dinas Dukcapil, bukan Lurah.",
        persyaratan: ["Kartu Keluarga", "KTP pemohon", "Data anggota keluarga yang ikut pindah"],
        estimasiHari: 1,
        tersedia: true,
        instansi: "dukcapil",
    },
    {
        id: "rekomendasi-nikah",
        kode: "RKN",
        nama: "Surat Pengantar Mohon Rekomendasi Nikah",
        deskripsi: "Pengantar dari Kalurahan untuk mengurus rekomendasi nikah.",
        persyaratan: ["KTP pemohon", "Kartu Keluarga", "Data calon istri"],
        estimasiHari: 2,
        tersedia: true,
    },
    {
        id: "dispensasi-nikah",
        kode: "DPN",
        nama: "Permohonan Dispensasi Nikah",
        deskripsi:
            "Permohonan dispensasi waktu pelaksanaan nikah kepada Panewu Kapanewon Tepus.",
        persyaratan: ["KTP mempelai", "Kartu Keluarga", "Data calon pasangan"],
        estimasiHari: 2,
        tersedia: true,
    },
    {
        id: "pengantar-nikah",
        kode: "PN",
        nama: "Pengantar Nikah (N1, N2, N4)",
        deskripsi: "Paket pengantar nikah untuk KUA: Model N1, N2, dan N4 sekaligus.",
        persyaratan: [
            "KTP pemohon",
            "Kartu Keluarga",
            "Data orang tua",
            "Data calon pasangan",
        ],
        estimasiHari: 3,
        tersedia: true,
    },
    {
        id: "perubahan-elemen-data",
        kode: "PED",
        nama: "Surat Pernyataan Perubahan Elemen Data (F-1.06)",
        deskripsi:
            "Pernyataan perubahan data kependudukan seperti pendidikan, pekerjaan, atau agama pada KK.",
        persyaratan: ["Kartu Keluarga", "KTP", "Bukti pendukung perubahan data (jika ada)"],
        estimasiHari: 1,
        tersedia: true,
        instansi: "dukcapil",
    },
    {
        id: "peristiwa-kependudukan",
        kode: "PPK",
        nama: "Formulir Pendaftaran Peristiwa Kependudukan (F-1.02)",
        deskripsi:
            "Formulir pendaftaran untuk pembuatan atau perubahan KK, KTP-el, dan Kartu Identitas Anak.",
        persyaratan: ["KTP", "Kartu Keluarga", "Dokumen pendukung sesuai jenis permohonan"],
        estimasiHari: 1,
        tersedia: true,
        instansi: "dukcapil",
    },
    {
        id: "biodata-keluarga",
        kode: "BDK",
        nama: "Formulir Biodata Keluarga (F-1.01)",
        deskripsi: "Pendaftaran biodata keluarga baru untuk penerbitan Kartu Keluarga.",
        persyaratan: [
            "Data lengkap seluruh anggota keluarga",
            "Dokumen pendukung (akta kelahiran/nikah/cerai jika ada)",
        ],
        estimasiHari: 3,
        tersedia: true,
        instansi: "dukcapil",
    },
];

export function getJenisSuratById(id: JenisSuratId): JenisSuratConfig | undefined {
    return JENIS_SURAT.find((jenis) => jenis.id === id);
}
