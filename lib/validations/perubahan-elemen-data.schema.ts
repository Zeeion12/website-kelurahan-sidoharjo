import { z } from "zod";
import { agamaSchema, alamatSchema, nikSchema, noKkSchema, pendidikanTerakhirSchema, shdkSchema } from "./shared.schema";

// Formulir F-1.06 Dukcapil (Surat Pernyataan Perubahan Elemen Data) -- bukan
// surat kalurahan, tidak berkop kalurahan dan tidak ditandatangani Lurah.
// Ditandatangani warga sendiri saja.

const anggotaKeluargaSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    nik: nikSchema,
    shdk: shdkSchema,
    keterangan: z.string().optional(),
});

const perubahanPendidikanPekerjaanSchema = z.object({
    nomorAnggota: z.coerce.number().int().min(1, "Nomor anggota wajib diisi"),
    pendidikanSemula: pendidikanTerakhirSchema.optional().or(z.literal("")),
    pendidikanMenjadi: pendidikanTerakhirSchema.optional().or(z.literal("")),
    dasarPerubahanPendidikan: z.string().optional(),
    pekerjaanSemula: z.string().optional(),
    pekerjaanMenjadi: z.string().optional(),
    dasarPerubahanPekerjaan: z.string().optional(),
    keterangan: z.string().optional(),
});

const perubahanAgamaLainnyaSchema = z.object({
    nomorAnggota: z.coerce.number().int().min(1, "Nomor anggota wajib diisi"),
    agamaSemula: agamaSchema.optional().or(z.literal("")),
    agamaMenjadi: agamaSchema.optional().or(z.literal("")),
    dasarPerubahanAgama: z.string().optional(),
    // isian "Lainnya, yaitu ..."
    namaElemenLainnya: z.string().optional(),
    lainnyaSemula: z.string().optional(),
    lainnyaMenjadi: z.string().optional(),
    dasarPerubahanLainnya: z.string().optional(),
    keterangan: z.string().optional(),
});

export const perubahanElemenDataSchema = z
    .object({
        namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),

        namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
        nik: nikSchema,
        nomorKK: noKkSchema,
        alamatRumah: alamatSchema,

        anggotaKeluarga: z
            .array(anggotaKeluargaSchema)
            .min(1, "Minimal 1 anggota keluarga")
            .max(10, "Maksimal 10 anggota keluarga"),

        perubahanPendidikanPekerjaan: z
            .array(perubahanPendidikanPekerjaanSchema)
            .max(7, "Maksimal 7 baris perubahan")
            .optional(),
        perubahanAgamaLainnya: z
            .array(perubahanAgamaLainnyaSchema)
            .max(7, "Maksimal 7 baris perubahan")
            .optional(),
    })
    .superRefine((values, ctx) => {
        const pendidikanPekerjaan = values.perubahanPendidikanPekerjaan ?? [];
        const agamaLainnya = values.perubahanAgamaLainnya ?? [];

        if (pendidikanPekerjaan.length === 0 && agamaLainnya.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Isi minimal satu perubahan data.",
                path: ["perubahanPendidikanPekerjaan"],
            });
        }

        const jumlahAnggota = values.anggotaKeluarga.length;

        pendidikanPekerjaan.forEach((baris, index) => {
            if (baris.nomorAnggota > jumlahAnggota) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nomor anggota tidak ada di daftar anggota keluarga",
                    path: ["perubahanPendidikanPekerjaan", index, "nomorAnggota"],
                });
            }

            if (!!baris.pendidikanSemula !== !!baris.pendidikanMenjadi) {
                ctx.addIssue({
                    code: "custom",
                    message: "Pendidikan semula dan menjadi harus diisi berpasangan",
                    path: ["perubahanPendidikanPekerjaan", index, "pendidikanMenjadi"],
                });
            }

            if (!!baris.pekerjaanSemula !== !!baris.pekerjaanMenjadi) {
                ctx.addIssue({
                    code: "custom",
                    message: "Pekerjaan semula dan menjadi harus diisi berpasangan",
                    path: ["perubahanPendidikanPekerjaan", index, "pekerjaanMenjadi"],
                });
            }
        });

        agamaLainnya.forEach((baris, index) => {
            if (baris.nomorAnggota > jumlahAnggota) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nomor anggota tidak ada di daftar anggota keluarga",
                    path: ["perubahanAgamaLainnya", index, "nomorAnggota"],
                });
            }

            if (!!baris.agamaSemula !== !!baris.agamaMenjadi) {
                ctx.addIssue({
                    code: "custom",
                    message: "Agama semula dan menjadi harus diisi berpasangan",
                    path: ["perubahanAgamaLainnya", index, "agamaMenjadi"],
                });
            }

            if (!!baris.lainnyaSemula !== !!baris.lainnyaMenjadi) {
                ctx.addIssue({
                    code: "custom",
                    message: "Data lainnya semula dan menjadi harus diisi berpasangan",
                    path: ["perubahanAgamaLainnya", index, "lainnyaMenjadi"],
                });
            }
        });
    });

export type PerubahanElemenDataFormValues = z.infer<typeof perubahanElemenDataSchema>;
export type PerubahanElemenDataFormInput = z.input<typeof perubahanElemenDataSchema>;
