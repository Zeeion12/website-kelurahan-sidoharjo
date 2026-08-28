import { z } from "zod";
import {
    agamaSchema,
    alamatSchema,
    dataOrangTuaNikahSchema,
    jenisKelaminSchema,
    kewarganegaraanSchema,
    nikSchema,
} from "./shared.schema";

// Satu pengajuan PN menghasilkan tiga dokumen sekaligus: N1 (Pengantar
// Nikah), N2 (Permohonan Kehendak Nikah), N4 (Persetujuan Calon Pengantin).
// `peranPemohon` menentukan varian dokumen & label (Bin/Binti,
// Jejaka-Duda/Perawan-Janda) -- sengaja tidak dipecah jadi skema terpisah
// untuk pria/wanita.
export const peranPemohonSchema = z.enum(
    ["calon-suami", "calon-istri"],
    "Peran pemohon wajib dipilih"
);

export const statusPernikahanPemohonSchema = z.enum(
    ["jejaka", "duda", "perawan", "janda"],
    "Status pernikahan wajib dipilih"
);

export const pengantarNikahSchema = z
    .object({
        namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),
        peranPemohon: peranPemohonSchema,

        // Data pemohon (warga Sidoharjo, subjek Model N1)
        namaPemohon: z.string().min(1, "Nama wajib diisi"),
        nikPemohon: nikSchema,
        jenisKelaminPemohon: jenisKelaminSchema,
        tempatLahirPemohon: z.string().min(1, "Tempat lahir wajib diisi"),
        tanggalLahirPemohon: z.iso.date("Tanggal lahir tidak valid"),
        kewarganegaraanPemohon: kewarganegaraanSchema,
        agamaPemohon: agamaSchema,
        pekerjaanPemohon: z.string().min(1, "Pekerjaan wajib diisi"),
        alamatPemohon: alamatSchema,
        statusPernikahanPemohon: statusPernikahanPemohonSchema,
        // hanya relevan kalau peranPemohon = calon-suami dan sudah pernah beristri
        istriKe: z.coerce.number().int().min(2, "Istri ke berapa minimal 2").optional().or(z.literal("")),

        // Data orang tua pemohon (Model N1 -- "seorang pria"/"seorang wanita")
        ...dataOrangTuaNikahSchema.shape,

        // Data calon pasangan (Model N2 dan N4)
        namaCalonPasangan: z.string().min(1, "Nama calon pasangan wajib diisi"),
        binBintiCalonPasangan: z.string().min(1, "Nama ayah calon pasangan wajib diisi"),
        nikCalonPasangan: nikSchema,
        tempatLahirCalonPasangan: z.string().min(1, "Tempat lahir calon pasangan wajib diisi"),
        tanggalLahirCalonPasangan: z.iso.date("Tanggal lahir calon pasangan tidak valid"),
        kewarganegaraanCalonPasangan: kewarganegaraanSchema,
        agamaCalonPasangan: agamaSchema,
        pekerjaanCalonPasangan: z.string().min(1, "Pekerjaan calon pasangan wajib diisi"),
        // alamat calon pasangan teks bebas -- bisa berdomisili di luar Sidoharjo
        alamatCalonPasangan: z.string().min(1, "Alamat calon pasangan wajib diisi"),

        // Rencana akad (Model N2)
        tanggalAkad: z.iso.date("Tanggal akad tidak valid"),
        jamAkad: z
            .string()
            .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam akad harus format HH:mm"),
        tempatAkad: z.string().min(1, "Tempat akad wajib diisi"),
        kuaTujuan: z.string().min(1, "KUA tujuan wajib diisi").default("KUA Kapanewon Tepus"),

        // Lampiran nomor 1-6 sudah teks baku di template, tidak perlu field.
        // Nomor 7-8 kosong dan bisa diisi manual, maksimal 2 item.
        lampiranTambahan: z.array(z.string().min(1)).max(2).optional(),
    })
    .superRefine((values, ctx) => {
        const statusLakiLaki = ["jejaka", "duda"];
        const statusPerempuan = ["perawan", "janda"];

        if (
            values.jenisKelaminPemohon === "laki-laki" &&
            !statusLakiLaki.includes(values.statusPernikahanPemohon)
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Untuk pemohon laki-laki, status pernikahan harus Jejaka atau Duda",
                path: ["statusPernikahanPemohon"],
            });
        }

        if (
            values.jenisKelaminPemohon === "perempuan" &&
            !statusPerempuan.includes(values.statusPernikahanPemohon)
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Untuk pemohon perempuan, status pernikahan harus Perawan atau Janda",
                path: ["statusPernikahanPemohon"],
            });
        }

        const hariIni = new Date();
        hariIni.setHours(0, 0, 0, 0);
        const tanggalAkad = new Date(values.tanggalAkad);

        if (values.tanggalAkad && tanggalAkad < hariIni) {
            ctx.addIssue({
                code: "custom",
                message: "Tanggal akad tidak boleh sebelum hari ini",
                path: ["tanggalAkad"],
            });
        }
    });

export type PengantarNikahFormValues = z.infer<typeof pengantarNikahSchema>;
export type PengantarNikahFormInput = z.input<typeof pengantarNikahSchema>;
