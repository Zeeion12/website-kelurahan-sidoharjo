import { z } from "zod";
import { agamaSchema, jenisKelaminSchema, nikSchema, statusPerkawinanSchema } from "./shared.schema";

export const pendidikanTerakhirSchema = z.enum(
    ["tidak-sekolah", "sd", "smp", "sma", "d3", "s1", "s2", "s3"],
    "Pendidikan terakhir wajib dipilih"
);

export const keteranganTidakMampuSchema = z.object({
    namaPemohon: z.string().min(1, "Nama wajib diisi"),
    ktpPemohon: nikSchema,
    kkPemohon: z.string().regex(/^\d{16}$/, "Nomor KK harus terdiri dari 16 digit angka"),
    tempatLahirPemohon: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahirPemohon: z.iso.date("Tanggal lahir tidak valid"),
    jenisKelaminPemohon: jenisKelaminSchema,
    statusPerkawinanPemohon: statusPerkawinanSchema,
    pekerjaanPemohon: z.string().min(1, "Pekerjaan wajib diisi"),
    pendidikanTerakhirPemohon: pendidikanTerakhirSchema,
    agamaPemohon: agamaSchema,
    alamatPemohon: z.string().min(1, "Alamat wajib diisi"),

    namaAnak: z.string().min(1, "Nama anak wajib diisi"),
    nikAnak: nikSchema,
    tempatLahirAnak: z.string().min(1, "Tempat lahir anak wajib diisi"),
    tanggalLahirAnak: z.iso.date("Tanggal lahir anak tidak valid"),
    jenisKelaminAnak: jenisKelaminSchema,
    namaSekolah: z.string().optional(),
    fakultasProdi: z.string().optional(),
    kelasSemester: z.string().optional(),
});

export type KeteranganTidakMampuFormValues = z.infer<typeof keteranganTidakMampuSchema>;
