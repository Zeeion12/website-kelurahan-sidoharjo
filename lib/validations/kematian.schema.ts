import { z } from "zod";
import { dataPelaporSchema, nikSchema } from "./shared.schema";

export const sebabKematianSchema = z.enum(
    ["sakit-tua", "wabah-penyakit", "kecelakaan", "kriminalitas", "bunuh-diri", "lainnya"],
    "Sebab kematian wajib dipilih"
);

export const yangMenerangkanSchema = z.enum(
    ["dokter", "tenaga-kesehatan", "kepolisian", "lainnya"],
    "Pihak yang menerangkan wajib dipilih"
);

export const kematianSchema = z.object({
    nikAlmarhum: nikSchema,
    namaAlmarhum: z.string().min(1, "Nama lengkap wajib diisi"),
    tanggalKematian: z.iso.date("Tanggal kematian tidak valid"),
    pukulKematian: z.string().min(1, "Pukul kematian wajib diisi"),
    sebabKematian: sebabKematianSchema,
    tempatKematian: z.string().min(1, "Tempat kematian wajib diisi"),
    yangMenerangkan: yangMenerangkanSchema,
    ...dataPelaporSchema.shape,
});

export type KematianFormValues = z.infer<typeof kematianSchema>;
