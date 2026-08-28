import { z } from "zod";
import {
    alamatSchema,
    dataOrangTuaSchema,
    dataPelaporSchema,
    dataSaksiSchema,
    jenisKelaminSchema,
    nikSchema,
} from "./shared.schema";

export const sebabKematianSchema = z.enum(
    ["sakit-tua", "wabah-penyakit", "kecelakaan", "kriminalitas", "bunuh-diri", "lainnya"],
    "Sebab kematian wajib dipilih"
);

export const yangMenerangkanSchema = z.enum(
    ["dokter", "tenaga-kesehatan", "kepolisian", "lainnya"],
    "Pihak yang menerangkan wajib dipilih"
);

export const kematianSchema = z.object({
    namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),
    nikAlmarhum: nikSchema,
    namaAlmarhum: z.string().min(1, "Nama lengkap wajib diisi"),
    tempatLahirAlmarhum: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahirAlmarhum: z.iso.date("Tanggal lahir tidak valid"),
    umurAlmarhum: z.coerce.number().int().positive("Umur wajib diisi"),
    jenisKelaminAlmarhum: jenisKelaminSchema,
    anakKeAlmarhum: z.coerce.number().int().positive("Anak ke berapa tidak valid").optional().or(z.literal("")),
    alamatTerakhirAlmarhum: alamatSchema,
    tanggalKematian: z.iso.date("Tanggal kematian tidak valid"),
    pukulKematian: z.string().min(1, "Pukul kematian wajib diisi"),
    sebabKematian: sebabKematianSchema,
    tempatKematian: z.string().min(1, "Tempat kematian wajib diisi"),
    yangMenerangkan: yangMenerangkanSchema,
    ...dataOrangTuaSchema.shape,
    saksi1: dataSaksiSchema,
    saksi2: dataSaksiSchema,
    ...dataPelaporSchema.shape,
    noHPPelapor: z.string().optional(),
});

export type KematianFormValues = z.infer<typeof kematianSchema>;
export type KematianFormInput = z.input<typeof kematianSchema>;
