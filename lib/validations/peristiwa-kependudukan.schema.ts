import { z } from "zod";
import { nikSchema, noKkSchema } from "./shared.schema";

// Formulir F-1.02 Dukcapil (Pendaftaran Peristiwa Kependudukan) -- bukan
// surat kalurahan. Ditandatangani petugas Dukcapil + pemohon.

export const kategoriPermohonanSchema = z.enum(
    ["kartu-keluarga", "ktp-el", "kartu-identitas-anak", "perubahan-data"],
    "Kategori permohonan wajib dipilih"
);

const JENIS_PERMOHONAN_PER_KATEGORI = {
    "kartu-keluarga": [
        "baru-membentuk-keluarga-baru",
        "baru-penggantian-kepala-keluarga",
        "baru-pisah-kk",
        "baru-pindah-datang",
        "baru-wni-dari-luar-negeri-karena-pindah",
        "baru-rentan-adminduk",
        "perubahan-menumpang-dalam-kk",
        "perubahan-peristiwa-penting",
        "perubahan-elemen-data-dalam-kk",
        "hilang",
        "rusak",
    ],
    "ktp-el": [
        "baru",
        "pindah-datang",
        "hilang",
        "rusak",
        "perpanjangan-itap",
        "perubahan-status-kewarganegaraan",
        "luar-domisili",
        "transmigrasi",
    ],
    "kartu-identitas-anak": ["baru", "hilang", "rusak", "perpanjangan-itap", "lainnya"],
    "perubahan-data": ["kk", "ktp-el", "kia"],
} as const;

export const jenisPermohonanSchema = z.enum(
    [
        ...JENIS_PERMOHONAN_PER_KATEGORI["kartu-keluarga"],
        ...JENIS_PERMOHONAN_PER_KATEGORI["ktp-el"],
        ...JENIS_PERMOHONAN_PER_KATEGORI["kartu-identitas-anak"],
        ...JENIS_PERMOHONAN_PER_KATEGORI["perubahan-data"],
    ],
    "Jenis permohonan wajib dipilih"
);

export const persyaratanDilampirkanSchema = z.enum(
    [
        "kk-lama-atau-rusak",
        "buku-nikah-atau-kutipan-akta-perkawinan",
        "kutipan-akta-perceraian",
        "surat-keterangan-pindah",
        "surat-keterangan-pindah-luar-negeri",
        "ktp-el-rusak",
        "dokumen-perjalanan",
        "surat-keterangan-hilang-dari-kepolisian",
        "surat-keterangan-bukti-perubahan-peristiwa-kependudukan",
        "sptjm-perkawinan-atau-perceraian-belum-tercatat",
        "akta-kematian",
        "surat-pernyataan-penyebab-hilang-atau-rusak",
        "surat-keterangan-pindah-dari-perwakilan-ri",
        "surat-pernyataan-bersedia-menerima-sebagai-anggota-keluarga",
        "surat-kuasa-pengasuhan-anak-dari-orang-tua-atau-wali",
        "kartu-izin-tinggal-tetap",
    ],
    "Persyaratan wajib dipilih"
);

export const PERSYARATAN_DILAMPIRKAN_LABEL: Record<
    z.infer<typeof persyaratanDilampirkanSchema>,
    string
> = {
    "kk-lama-atau-rusak": "KK lama atau rusak",
    "buku-nikah-atau-kutipan-akta-perkawinan": "Buku nikah atau kutipan akta perkawinan",
    "kutipan-akta-perceraian": "Kutipan akta perceraian",
    "surat-keterangan-pindah": "Surat keterangan pindah",
    "surat-keterangan-pindah-luar-negeri": "Surat keterangan pindah luar negeri",
    "ktp-el-rusak": "KTP-el rusak",
    "dokumen-perjalanan": "Dokumen perjalanan",
    "surat-keterangan-hilang-dari-kepolisian": "Surat keterangan hilang dari kepolisian",
    "surat-keterangan-bukti-perubahan-peristiwa-kependudukan":
        "Surat keterangan bukti perubahan peristiwa kependudukan",
    "sptjm-perkawinan-atau-perceraian-belum-tercatat":
        "SPTJM perkawinan/perceraian belum tercatat",
    "akta-kematian": "Akta kematian",
    "surat-pernyataan-penyebab-hilang-atau-rusak": "Surat pernyataan penyebab hilang/rusak",
    "surat-keterangan-pindah-dari-perwakilan-ri":
        "Surat keterangan pindah dari Perwakilan RI",
    "surat-pernyataan-bersedia-menerima-sebagai-anggota-keluarga":
        "Surat pernyataan bersedia menerima sebagai anggota keluarga",
    "surat-kuasa-pengasuhan-anak-dari-orang-tua-atau-wali":
        "Surat kuasa pengasuhan anak dari orang tua/wali",
    "kartu-izin-tinggal-tetap": "Kartu izin tinggal tetap",
};

export const peristiwaKependudukanSchema = z
    .object({
        namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),

        namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
        nik: nikSchema,
        nomorKK: noKkSchema,

        kategoriPermohonan: kategoriPermohonanSchema,
        jenisPermohonan: jenisPermohonanSchema,

        persyaratanDilampirkan: z
            .array(persyaratanDilampirkanSchema)
            .min(1, "Pilih minimal 1 persyaratan yang dilampirkan"),
    })
    .superRefine((values, ctx) => {
        const opsiValid: readonly string[] =
            JENIS_PERMOHONAN_PER_KATEGORI[values.kategoriPermohonan] ?? [];

        if (values.jenisPermohonan && !opsiValid.includes(values.jenisPermohonan)) {
            ctx.addIssue({
                code: "custom",
                message: "Jenis permohonan tidak sesuai dengan kategori yang dipilih",
                path: ["jenisPermohonan"],
            });
        }
    });

export type PeristiwaKependudukanFormValues = z.infer<typeof peristiwaKependudukanSchema>;
export type PeristiwaKependudukanFormInput = z.input<typeof peristiwaKependudukanSchema>;
