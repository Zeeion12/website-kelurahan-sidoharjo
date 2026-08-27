import { z } from "zod";
import {
    agamaSchema,
    alamatSchema,
    jenisKelaminSchema,
    kewarganegaraanSchema,
    statusPerkawinanSchema,
} from "./shared.schema";

// Ditujukan ke Panewu Kapanewon Tepus (bukan Dukcapil/KUA). Template aslinya
// menulis blok pertama sebagai "mempelai" lalu blok kedua sebagai "Calon
// Suami" -- artinya blok pertama implisit perempuan. Nama field di sini
// sengaja dibuat netral (Mempelai / CalonPasangan) supaya form bisa dipakai
// dua arah; label di template .docx nanti perlu disesuaikan manual.
export const dispensasiNikahSchema = z
    .object({
        namaMempelai: z.string().min(1, "Nama wajib diisi"),
        jenisKelaminMempelai: jenisKelaminSchema,
        tempatLahirMempelai: z.string().min(1, "Tempat lahir wajib diisi"),
        tanggalLahirMempelai: z.iso.date("Tanggal lahir tidak valid"),
        kewarganegaraanMempelai: kewarganegaraanSchema,
        agamaMempelai: agamaSchema,
        pekerjaanMempelai: z.string().min(1, "Pekerjaan wajib diisi"),
        statusPerkawinanMempelai: statusPerkawinanSchema,
        alamatMempelai: alamatSchema,

        namaCalonPasangan: z.string().min(1, "Nama calon pasangan wajib diisi"),
        jenisKelaminCalonPasangan: jenisKelaminSchema,
        tempatLahirCalonPasangan: z.string().min(1, "Tempat lahir calon pasangan wajib diisi"),
        tanggalLahirCalonPasangan: z.iso.date("Tanggal lahir calon pasangan tidak valid"),
        kewarganegaraanCalonPasangan: kewarganegaraanSchema,
        agamaCalonPasangan: agamaSchema,
        pekerjaanCalonPasangan: z.string().min(1, "Pekerjaan calon pasangan wajib diisi"),
        statusPerkawinanCalonPasangan: statusPerkawinanSchema,
        // alamat calon pasangan teks bebas -- bisa berdomisili di luar Sidoharjo
        alamatCalonPasangan: z.string().min(1, "Alamat calon pasangan wajib diisi"),

        tanggalAkad: z.iso.date("Tanggal akad tidak valid"),
        jamAkad: z
            .string()
            .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam akad harus format HH:mm"),
        tempatAkad: z.string().min(1, "Tempat akad wajib diisi"),
    })
    .superRefine((values, ctx) => {
        const hariIni = new Date();
        hariIni.setHours(0, 0, 0, 0);
        const tanggalAkad = new Date(values.tanggalAkad);

        if (values.tanggalAkad && tanggalAkad < hariIni) {
            ctx.addIssue({
                code: "custom",
                message: "Tanggal akad tidak boleh sebelum hari ini",
                path: ["tanggalAkad"],
            });
        }
    });

export type DispensasiNikahFormValues = z.infer<typeof dispensasiNikahSchema>;
export type DispensasiNikahFormInput = z.input<typeof dispensasiNikahSchema>;
