import { z } from "zod";
import {
    agamaSchema,
    alamatSchema,
    jenisKelaminSchema,
    nikSchema,
    pendidikanTerakhirSchema,
    statusPerkawinanSchema,
} from "./shared.schema";

export const keperluanSktmSchema = z.enum(
    ["kis-bpjs-pbi", "beasiswa", "lainnya"],
    "Keperluan wajib dipilih"
);

const anggotaKeluargaSchema = z.object({
    nama: z.string().min(1, "Nama anggota keluarga wajib diisi"),
    nik: nikSchema,
    hubunganKeluarga: z.string().min(1, "Hubungan keluarga wajib diisi"),
    keterangan: z.string().optional(),
});

export const keteranganTidakMampuSchema = z
    .object({
        namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),
        namaPemohon: z.string().min(1, "Nama wajib diisi"),
        ktpPemohon: nikSchema,
        kkPemohon: z.string().regex(/^\d{16}$/, "Nomor KK harus terdiri dari 16 digit angka"),
        jenisKelaminPemohon: jenisKelaminSchema,
        tempatLahirPemohon: z.string().min(1, "Tempat lahir wajib diisi"),
        tanggalLahirPemohon: z.iso.date("Tanggal lahir tidak valid"),
        agamaPemohon: agamaSchema,
        statusPerkawinanPemohon: statusPerkawinanSchema,
        pekerjaanPemohon: z.string().min(1, "Pekerjaan wajib diisi"),
        pendidikanTerakhirPemohon: pendidikanTerakhirSchema.optional().or(z.literal("")),
        alamatPemohon: alamatSchema,

        keperluan: keperluanSktmSchema,
        penghasilanPerBulan: z.coerce.number().nonnegative().optional().or(z.literal("")),
        anggotaKeluarga: z.array(anggotaKeluargaSchema).optional(),

        // Blok anak opsional -- SKTM di Sidoharjo umumnya dipakai untuk
        // KIS/BPJS, bukan keperluan sekolah/kuliah, jadi tidak selalu diisi.
        namaAnak: z.string().optional(),
        nikAnak: z.string().regex(/^\d{16}$/, "NIK anak harus 16 digit angka").optional().or(z.literal("")),
        tempatLahirAnak: z.string().optional(),
        tanggalLahirAnak: z.iso.date("Tanggal lahir anak tidak valid").optional().or(z.literal("")),
        jenisKelaminAnak: jenisKelaminSchema.optional().or(z.literal("")),
        namaSekolah: z.string().optional(),
        fakultasProdi: z.string().optional(),
        kelasSemester: z.string().optional(),
    })
    .refine(
        (values) =>
            values.keperluan !== "kis-bpjs-pbi" ||
            (typeof values.penghasilanPerBulan === "number" && values.penghasilanPerBulan >= 0),
        {
            message: "Penghasilan per bulan wajib diisi untuk keperluan KIS/BPJS PBI",
            path: ["penghasilanPerBulan"],
        }
    );

export type KeteranganTidakMampuFormValues = z.infer<typeof keteranganTidakMampuSchema>;
export type KeteranganTidakMampuFormInput = z.input<typeof keteranganTidakMampuSchema>;
