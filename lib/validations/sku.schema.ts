import { z } from "zod";
import {
    agamaSchema,
    alamatSchema,
    jenisKelaminSchema,
    nikSchema,
    statusPerkawinanSchema,
} from "./shared.schema";

export const skuSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    nik: nikSchema,
    jenisKelamin: jenisKelaminSchema,
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahir: z.iso.date("Tanggal lahir tidak valid"),
    agama: agamaSchema,
    statusPerkawinan: statusPerkawinanSchema,
    pekerjaan: z.string().min(1, "Pekerjaan wajib diisi"),
    alamat: alamatSchema,
    bidangUsaha: z.string().min(1, "Bidang usaha wajib diisi"),
    lokasiUsaha: z.string().min(1, "Lokasi usaha wajib diisi"),
});

export type SkuFormValues = z.infer<typeof skuSchema>;
