import { z } from "zod";
import {
    agamaSchema,
    alamatSchema,
    golonganDarahSchema,
    jenisKelaminSchema,
    kewarganegaraanSchema,
    nikSchema,
    pendidikanTerakhirSchema,
    shdkSchema,
    statusPerkawinanSchema,
    tipeSponsorSchema,
} from "./shared.schema";

// Formulir F-1.01 Dukcapil (Biodata Keluarga) -- bukan surat kalurahan, tidak
// berkop kalurahan dan Lurah tidak menandatanganinya. Ditandatangani Kepala
// Dinas Dukcapil + Kepala Keluarga.
//
// Data wilayah (kolom 9-12: Provinsi/Kabupaten/Kecamatan/Kelurahan) sudah
// tetap untuk seluruh warga Sidoharjo -- dijadikan konstanta, bukan input.
export const WILAYAH_TETAP_BDK = {
    provinsi: "34 - Daerah Istimewa Yogyakarta",
    kabupaten: "03 - Gunungkidul",
    kecamatan: "Tepus",
    kelurahan: "Sidoharjo",
} as const;

export const jenisInputBdkSchema = z.enum(
    ["wni", "orang-asing", "wni-luar-negeri"],
    "Jenis input wajib dipilih"
);

// Nomor kolom di komentar merujuk ke nomor kolom formulir F-1.01 asli, supaya
// mudah dicocokkan saat membuat template .docx nanti. Tidak ada field NIK
// anggota keluarga di sini -- NIK justru diterbitkan Dukcapil dari formulir
// ini, jadi disengaja tidak diminta.
const anggotaKeluargaBdkSchema = z.object({
    namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"), // 2
    gelarDepan: z.string().optional(), // 3
    gelarBelakang: z.string().optional(), // 4
    nomorPaspor: z.string().optional(), // 5
    tanggalBerakhirPaspor: z.iso.date("Tanggal tidak valid").optional().or(z.literal("")), // 6
    namaSponsor: z.string().optional(), // 7 -- wajib jika orang-asing
    tipeSponsor: tipeSponsorSchema.optional().or(z.literal("")), // 8 -- wajib jika orang-asing
    alamatSponsor: z.string().optional(), // 9 -- wajib jika orang-asing
    jenisKelamin: jenisKelaminSchema, // 10
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"), // 11
    tanggalLahir: z.iso.date("Tanggal lahir tidak valid"), // 12
    kewarganegaraan: kewarganegaraanSchema, // 13
    nomorSKPenetapanWNI: z.string().optional(), // 14
    punyaAktaLahir: z.boolean(), // 15
    nomorAktaKelahiran: z.string().optional(), // 16 -- wajib jika punyaAktaLahir
    golonganDarah: golonganDarahSchema.optional().or(z.literal("")), // 17
    agama: agamaSchema, // 18
    namaOrganisasiKepercayaan: z.string().optional(), // 19
    statusPerkawinan: statusPerkawinanSchema, // 20
    punyaAktaPerkawinan: z.boolean(), // 21
    nomorAktaPerkawinan: z.string().optional(), // 22 -- wajib jika punyaAktaPerkawinan
    tanggalPerkawinan: z.iso.date("Tanggal tidak valid").optional().or(z.literal("")), // 23 -- wajib jika punyaAktaPerkawinan
    punyaAktaCerai: z.boolean(), // 24
    nomorAktaPerceraian: z.string().optional(), // 25 -- wajib jika punyaAktaCerai
    tanggalPerceraian: z.iso.date("Tanggal tidak valid").optional().or(z.literal("")), // 26 -- wajib jika punyaAktaCerai
    shdk: shdkSchema, // 27
    kelainanFisikMental: z.string().optional(), // 28
    penyandangCacat: z.string().optional(), // 29
    pendidikanTerakhir: pendidikanTerakhirSchema, // 30
    jenisPekerjaan: z.string().min(1, "Jenis pekerjaan wajib diisi"), // 31
    nomorItasItap: z.string().optional(), // 32 -- wajib jika orang-asing
    tempatTerbitItasItap: z.string().optional(), // 33 -- wajib jika orang-asing
    tanggalTerbitItasItap: z.iso.date("Tanggal tidak valid").optional().or(z.literal("")), // 34
    tanggalAkhirItasItap: z.iso.date("Tanggal tidak valid").optional().or(z.literal("")), // 35
    tempatDatangPertama: z.string().optional(), // 36 -- wajib jika orang-asing
    tanggalKedatanganPertama: z.iso.date("Tanggal tidak valid").optional().or(z.literal("")), // 37
    nikIbu: nikSchema, // 38
    namaIbu: z.string().min(1, "Nama ibu wajib diisi"), // 39
    nikAyah: nikSchema, // 40
    namaAyah: z.string().min(1, "Nama ayah wajib diisi"), // 41
});

export const biodataKeluargaSchema = z
    .object({
        namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),

        jenisInput: jenisInputBdkSchema,

        namaKepalaKeluarga: z.string().min(1, "Nama kepala keluarga wajib diisi"),
        alamat: alamatSchema,
        kodePos: z
            .string()
            .regex(/^\d{5}$/, "Kode pos harus 5 digit angka")
            .default("55881"),
        jumlahAnggotaKeluarga: z.coerce
            .number()
            .int()
            .min(1, "Minimal 1 anggota keluarga")
            .max(10, "Maksimal 10 anggota keluarga"),
        telepon: z.string().optional(),
        email: z.email("Email tidak valid").optional().or(z.literal("")),

        // Hanya relevan & divalidasi kalau jenisInput = wni-luar-negeri
        alamatLuarNegeri: z.string().optional(),
        kotaLuarNegeri: z.string().optional(),
        provinsiNegaraBagian: z.string().optional(),
        negara: z.string().optional(),
        kodePosLuarNegeri: z.string().optional(),
        teleponLuarNegeri: z.string().optional(),
        emailLuarNegeri: z.email("Email tidak valid").optional().or(z.literal("")),

        anggotaKeluarga: z
            .array(anggotaKeluargaBdkSchema)
            .min(1, "Minimal 1 anggota keluarga")
            .max(10, "Maksimal 10 anggota keluarga"),
    })
    .superRefine((values, ctx) => {
        if (values.anggotaKeluarga.length !== values.jumlahAnggotaKeluarga) {
            ctx.addIssue({
                code: "custom",
                message: "Jumlah anggota keluarga tidak sesuai dengan daftar anggota yang diisi",
                path: ["jumlahAnggotaKeluarga"],
            });
        }

        const kepalaKeluarga = values.anggotaKeluarga.filter(
            (anggota) => anggota.shdk === "kepala-keluarga"
        );

        if (kepalaKeluarga.length !== 1) {
            ctx.addIssue({
                code: "custom",
                message: "Harus ada tepat satu anggota dengan status Kepala Keluarga",
                path: ["anggotaKeluarga"],
            });
        } else if (kepalaKeluarga[0].namaLengkap !== values.namaKepalaKeluarga) {
            ctx.addIssue({
                code: "custom",
                message: "Nama Kepala Keluarga harus sama dengan anggota berstatus Kepala Keluarga",
                path: ["namaKepalaKeluarga"],
            });
        }

        if (values.jenisInput === "wni-luar-negeri") {
            if (!values.alamatLuarNegeri?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Alamat luar negeri wajib diisi",
                    path: ["alamatLuarNegeri"],
                });
            }
            if (!values.kotaLuarNegeri?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Kota luar negeri wajib diisi",
                    path: ["kotaLuarNegeri"],
                });
            }
            if (!values.negara?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Negara wajib diisi",
                    path: ["negara"],
                });
            }
        }

        const butuhDataOrangAsing = values.jenisInput === "orang-asing";

        values.anggotaKeluarga.forEach((anggota, index) => {
            if (butuhDataOrangAsing) {
                if (!anggota.namaSponsor?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Nama sponsor wajib diisi untuk orang asing",
                        path: ["anggotaKeluarga", index, "namaSponsor"],
                    });
                }
                if (!anggota.tipeSponsor) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Tipe sponsor wajib dipilih untuk orang asing",
                        path: ["anggotaKeluarga", index, "tipeSponsor"],
                    });
                }
                if (!anggota.alamatSponsor?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Alamat sponsor wajib diisi untuk orang asing",
                        path: ["anggotaKeluarga", index, "alamatSponsor"],
                    });
                }
                if (!anggota.nomorItasItap?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Nomor ITAS/ITAP wajib diisi untuk orang asing",
                        path: ["anggotaKeluarga", index, "nomorItasItap"],
                    });
                }
                if (!anggota.tempatTerbitItasItap?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Tempat terbit ITAS/ITAP wajib diisi untuk orang asing",
                        path: ["anggotaKeluarga", index, "tempatTerbitItasItap"],
                    });
                }
                if (!anggota.tempatDatangPertama?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Tempat datang pertama wajib diisi untuk orang asing",
                        path: ["anggotaKeluarga", index, "tempatDatangPertama"],
                    });
                }
            }

            if (anggota.punyaAktaLahir && !anggota.nomorAktaKelahiran?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nomor akta kelahiran wajib diisi",
                    path: ["anggotaKeluarga", index, "nomorAktaKelahiran"],
                });
            }

            if (anggota.punyaAktaPerkawinan) {
                if (!anggota.nomorAktaPerkawinan?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Nomor akta perkawinan wajib diisi",
                        path: ["anggotaKeluarga", index, "nomorAktaPerkawinan"],
                    });
                }
                if (!anggota.tanggalPerkawinan) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Tanggal perkawinan wajib diisi",
                        path: ["anggotaKeluarga", index, "tanggalPerkawinan"],
                    });
                }
            }

            if (anggota.punyaAktaCerai) {
                if (!anggota.nomorAktaPerceraian?.trim()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Nomor akta perceraian wajib diisi",
                        path: ["anggotaKeluarga", index, "nomorAktaPerceraian"],
                    });
                }
                if (!anggota.tanggalPerceraian) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Tanggal perceraian wajib diisi",
                        path: ["anggotaKeluarga", index, "tanggalPerceraian"],
                    });
                }
            }
        });
    });

export type BiodataKeluargaFormValues = z.infer<typeof biodataKeluargaSchema>;
export type BiodataKeluargaFormInput = z.input<typeof biodataKeluargaSchema>;
export type AnggotaKeluargaBdkInput = z.input<typeof anggotaKeluargaBdkSchema>;
