import { z } from "zod";
import {
    agamaSchema,
    alamatSchema,
    jenisKelaminSchema,
    nikSchema,
    noKkSchema,
    pendidikanTerakhirSchema,
    statusPerkawinanSchema,
} from "./shared.schema";

export const skuSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    nik: nikSchema,
    noKK: noKkSchema,
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahir: z.iso.date("Tanggal lahir tidak valid"),
    jenisKelamin: jenisKelaminSchema,
    statusPerkawinan: statusPerkawinanSchema,
    pekerjaan: z.string().min(1, "Pekerjaan wajib diisi"),
    pendidikanTerakhir: pendidikanTerakhirSchema,
    agama: agamaSchema,
    alamat: alamatSchema,
    bidangUsaha: z.string().min(1, "Bidang usaha wajib diisi"),
    jenisUsaha: z.string().min(1, "Jenis usaha wajib diisi"),
    lokasiUsaha: z.string().min(1, "Lokasi usaha wajib diisi"),
});

export type SkuFormValues = z.infer<typeof skuSchema>;
