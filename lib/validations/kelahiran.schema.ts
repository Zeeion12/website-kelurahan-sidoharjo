import { z } from "zod";
import {
    dataOrangTuaSchema,
    dataPelaporSchema,
    dataSaksiSchema,
    jenisKelaminSchema,
} from "./shared.schema";

export const jenisKelahiranSchema = z.enum(
    ["tunggal", "kembar-2", "kembar-3", "kembar-4", "lainnya"],
    "Jenis kelahiran wajib dipilih"
);

export const penolongKelahiranSchema = z.enum(
    ["dokter", "bidan-perawat", "dukun", "lainnya"],
    "Penolong kelahiran wajib dipilih"
);

export const kelahiranSchema = z.object({
    laporanKelahiran: z.enum(["umum", "terlambat"], "Jenis laporan wajib dipilih"),
    ...dataOrangTuaSchema.shape,
    namaAnak: z.string().min(1, "Nama anak wajib diisi"),
    jenisKelaminAnak: jenisKelaminSchema,
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahir: z.iso.date("Tanggal lahir tidak valid"),
    jamLahir: z.string().min(1, "Jam lahir wajib diisi"),
    jenisKelahiran: jenisKelahiranSchema,
    anakKe: z.coerce.number().int().positive("Anak ke berapa wajib diisi"),
    penolongKelahiran: penolongKelahiranSchema,
    beratBayiKg: z.coerce.number().positive("Berat bayi wajib diisi"),
    panjangBayiCm: z.coerce.number().positive("Panjang bayi wajib diisi"),
    ...dataPelaporSchema.shape,
    saksi1: dataSaksiSchema,
    saksi2: dataSaksiSchema,
});

export type KelahiranFormValues = z.infer<typeof kelahiranSchema>;
// Bentuk sebelum divalidasi/di-coerce oleh zod (mis. anakKe & beratBayiKg
// masih boleh berupa string dari <input>) — dipakai sebagai tipe generik
// useForm supaya cocok dengan zodResolver.
export type KelahiranFormInput = z.input<typeof kelahiranSchema>;
