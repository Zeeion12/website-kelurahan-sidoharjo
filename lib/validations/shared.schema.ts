import { z } from "zod";

export const nikSchema = z
    .string()
    .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka");

export const jenisKelaminSchema = z.enum(
    ["laki-laki", "perempuan"],
    "Jenis kelamin wajib dipilih"
);

export const agamaSchema = z.enum(
    ["islam", "kristen", "katholik", "hindu", "buddha", "konghucu"],
    "Agama wajib dipilih"
);

export const statusPerkawinanSchema = z.enum(
    ["belum-kawin", "kawin", "cerai-hidup", "cerai-mati"],
    "Status perkawinan wajib dipilih"
);

export const alamatSchema = z.object({
    padukuhan: z.string().min(1, "Padukuhan wajib diisi"),
    rt: z.string().regex(/^\d{1,2}$/, "RT harus berupa angka"),
    rw: z.string().regex(/^\d{1,2}$/, "RW harus berupa angka"),
});

export const dataPelaporSchema = z.object({
    namaPelapor: z.string().min(1, "Nama pelapor wajib diisi"),
    nikPelapor: nikSchema,
    pekerjaanPelapor: z.string().min(1, "Pekerjaan pelapor wajib diisi"),
    alamatPelapor: alamatSchema,
});

export const dataOrangTuaSchema = z.object({
    namaAyah: z.string().min(1, "Nama ayah wajib diisi"),
    nikAyah: nikSchema,
    pekerjaanAyah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
    alamatAyah: alamatSchema,
    namaIbu: z.string().min(1, "Nama ibu wajib diisi"),
    nikIbu: nikSchema,
    pekerjaanIbu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
    alamatIbu: alamatSchema,
    tanggalPerkawinan: z.iso.date("Tanggal perkawinan tidak valid").optional(),
});

export const dataSaksiSchema = z.object({
    nama: z.string().min(1, "Nama saksi wajib diisi"),
    umur: z.coerce.number().int().positive("Umur saksi wajib diisi"),
    pekerjaan: z.string().min(1, "Pekerjaan saksi wajib diisi"),
    alamat: z.string().min(1, "Alamat saksi wajib diisi"),
});
