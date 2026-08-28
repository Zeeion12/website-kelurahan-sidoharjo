import { z } from "zod";
import { agamaSchema, alamatSchema, nikSchema } from "./shared.schema";

// Template surat ini eksplisit menyebut pemohon sebagai laki-laki dan pihak
// kedua sebagai perempuan ("akan melangsungkan pernikahan dengan seorang
// Perempuan") -- jadi tidak ada field jenis kelamin di skema ini.
export const rekomendasiNikahSchema = z.object({
    namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),
    namaPemohon: z.string().min(1, "Nama wajib diisi"),
    // tidak ada di template resmi, untuk verifikasi internal
    nikPemohon: nikSchema.optional().or(z.literal("")),
    tempatLahirPemohon: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahirPemohon: z.iso.date("Tanggal lahir tidak valid"),
    agamaPemohon: agamaSchema,
    pekerjaanPemohon: z.string().min(1, "Pekerjaan wajib diisi"),
    alamatPemohon: alamatSchema,

    namaCalonIstri: z.string().min(1, "Nama calon istri wajib diisi"),
    tempatLahirCalonIstri: z.string().min(1, "Tempat lahir calon istri wajib diisi"),
    tanggalLahirCalonIstri: z.iso.date("Tanggal lahir calon istri tidak valid"),
    agamaCalonIstri: agamaSchema,
    pekerjaanCalonIstri: z.string().min(1, "Pekerjaan calon istri wajib diisi"),
    // alamat calon istri teks bebas -- bisa berdomisili di luar Sidoharjo
    alamatCalonIstri: z.string().min(1, "Alamat calon istri wajib diisi"),
});

export type RekomendasiNikahFormValues = z.infer<typeof rekomendasiNikahSchema>;
export type RekomendasiNikahFormInput = z.input<typeof rekomendasiNikahSchema>;
