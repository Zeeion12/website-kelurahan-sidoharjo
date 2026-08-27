import { z } from "zod";
import { PADUKUHAN_SIDOHARJO } from "@/config/padukuhan";

export const nikSchema = z
    .string()
    .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka");

export const noKkSchema = z
    .string()
    .regex(/^\d{16}$/, "Nomor KK harus terdiri dari 16 digit angka");

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

export const kewarganegaraanSchema = z.enum(["wni", "wna"], "Kewarganegaraan wajib dipilih");

export const pendidikanTerakhirSchema = z.enum(
    ["tidak-sekolah", "sd", "smp", "sma", "d3", "s1", "s2", "s3"],
    "Pendidikan terakhir wajib dipilih"
);

export const tempatPerkawinanSchema = z.enum(
    ["kua", "gereja", "pure"],
    "Tempat perkawinan wajib dipilih"
);

export const tempatDilahirkanSchema = z.enum(
    ["rs-bidan", "puskesmas", "polindes", "rumah", "lainnya"],
    "Tempat dilahirkan wajib dipilih"
);

export const padukuhanSchema = z.enum(PADUKUHAN_SIDOHARJO, "Padukuhan wajib dipilih");

export const alamatSchema = z.object({
    padukuhan: padukuhanSchema,
    rt: z.string().regex(/^\d{1,2}$/, "RT harus berupa angka"),
    rw: z.string().regex(/^\d{1,2}$/, "RW harus berupa angka"),
});

export const dataPelaporSchema = z.object({
    namaPelapor: z.string().min(1, "Nama pelapor wajib diisi"),
    nikPelapor: nikSchema,
    noKKPelapor: noKkSchema,
    umurPelapor: z.coerce.number().int().positive("Umur pelapor wajib diisi"),
    kewarganegaraanPelapor: kewarganegaraanSchema,
    pekerjaanPelapor: z.string().min(1, "Pekerjaan pelapor wajib diisi"),
    alamatPelapor: alamatSchema,
});

export const dataOrangTuaSchema = z.object({
    namaAyah: z.string().min(1, "Nama ayah wajib diisi"),
    nikAyah: nikSchema,
    tempatLahirAyah: z.string().min(1, "Tempat lahir ayah wajib diisi"),
    tanggalLahirAyah: z.iso.date("Tanggal lahir ayah tidak valid"),
    umurAyah: z.coerce.number().int().positive("Umur ayah wajib diisi"),
    kewarganegaraanAyah: kewarganegaraanSchema,
    pekerjaanAyah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
    alamatAyah: alamatSchema,
    namaIbu: z.string().min(1, "Nama ibu wajib diisi"),
    nikIbu: nikSchema,
    tempatLahirIbu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
    tanggalLahirIbu: z.iso.date("Tanggal lahir ibu tidak valid"),
    umurIbu: z.coerce.number().int().positive("Umur ibu wajib diisi"),
    kewarganegaraanIbu: kewarganegaraanSchema,
    pekerjaanIbu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
    alamatIbu: alamatSchema,
    tempatPerkawinan: tempatPerkawinanSchema.optional().or(z.literal("")),
    tanggalPerkawinan: z.iso
        .date("Tanggal perkawinan tidak valid")
        .optional()
        .or(z.literal("")),
});

// Dipakai khusus surat-surat nikah (RKN/DPN/PN) -- BEDA dari `dataOrangTua`
// di atas (dipakai KLH/LHM/KTN). Di sini butuh agama & kewarganegaraan, dan
// alamatnya teks bebas karena orang tua bisa berdomisili di luar Sidoharjo.
// Jangan ubah `dataOrangTua` yang lama, skema-skema itu masih memakainya.
export const dataOrangTuaNikahSchema = z.object({
    namaAyah: z.string().min(1, "Nama ayah wajib diisi"),
    nikAyah: nikSchema,
    tempatLahirAyah: z.string().min(1, "Tempat lahir ayah wajib diisi"),
    tanggalLahirAyah: z.iso.date("Tanggal lahir ayah tidak valid"),
    kewarganegaraanAyah: kewarganegaraanSchema,
    agamaAyah: agamaSchema,
    pekerjaanAyah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
    alamatAyah: z.string().min(1, "Alamat ayah wajib diisi"),
    namaIbu: z.string().min(1, "Nama ibu wajib diisi"),
    nikIbu: nikSchema,
    tempatLahirIbu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
    tanggalLahirIbu: z.iso.date("Tanggal lahir ibu tidak valid"),
    kewarganegaraanIbu: kewarganegaraanSchema,
    agamaIbu: agamaSchema,
    pekerjaanIbu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
    alamatIbu: z.string().min(1, "Alamat ibu wajib diisi"),
});

export const dataSaksiSchema = z.object({
    nama: z.string().min(1, "Nama saksi wajib diisi"),
    nik: nikSchema,
    noKK: noKkSchema.optional().or(z.literal("")),
    kewarganegaraan: kewarganegaraanSchema,
    umur: z.coerce.number().int().positive("Umur saksi wajib diisi"),
    pekerjaan: z.string().min(1, "Pekerjaan saksi wajib diisi"),
    alamat: z.string().min(1, "Alamat saksi wajib diisi"),
});
