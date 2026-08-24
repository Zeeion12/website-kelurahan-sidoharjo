import { z } from "zod";
import { dataOrangTuaSchema, dataPelaporSchema, jenisKelaminSchema } from "./shared.schema";
import { jenisKelahiranSchema, penolongKelahiranSchema } from "./kelahiran.schema";

export const tempatDilahirkanSchema = z.enum(
    ["rs-bidan", "puskesmas", "polindes", "rumah", "lainnya"],
    "Tempat dilahirkan wajib dipilih"
);

export const yangMenentukanLahirMatiSchema = z.enum(
    ["dokter", "bidan-perawat", "tenaga-kesehatan", "kepolisian", "lainnya"],
    "Pihak yang menentukan wajib dipilih"
);

export const lahirMatiSchema = z.object({
    ...dataOrangTuaSchema.shape,
    jenisKelaminAnak: jenisKelaminSchema,
    lamanyaDalamKandunganBulan: z.coerce
        .number()
        .positive("Lamanya dalam kandungan wajib diisi"),
    tanggalLahirMati: z.iso.date("Tanggal lahir mati tidak valid"),
    jenisKelahiran: jenisKelahiranSchema,
    anakKe: z.coerce.number().int().positive("Anak ke berapa wajib diisi"),
    tempatDilahirkan: tempatDilahirkanSchema,
    penolongKelahiran: penolongKelahiranSchema,
    sebabLahirMati: z.string().min(1, "Sebab lahir mati wajib diisi"),
    yangMenentukan: yangMenentukanLahirMatiSchema,
    ...dataPelaporSchema.shape,
});

export type LahirMatiFormValues = z.infer<typeof lahirMatiSchema>;
// Bentuk sebelum divalidasi/di-coerce oleh zod (lihat catatan yang sama di
// kelahiran.schema.ts) — dipakai sebagai tipe generik useForm.
export type LahirMatiFormInput = z.input<typeof lahirMatiSchema>;
