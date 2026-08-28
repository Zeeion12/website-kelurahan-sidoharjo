import { z } from "zod";
import { alamatSchema, nikSchema, noKkSchema, shdkSchema, tipeSponsorSchema } from "./shared.schema";

// Formulir F-1.03 Dukcapil -- Lurah tidak ikut tanda tangan di sini,
// penanda tangan resminya Kepala Dinas Dukcapil + Pelapor. Aplikasi ini
// cuma bantu warga mengisi datanya sebelum dicetak & dibawa ke Dukcapil.

export const jenisPermohonanPindahSchema = z.enum(
    [
        "surat-keterangan-pindah",
        "surat-keterangan-pindah-luar-negeri",
        "surat-keterangan-tempat-tinggal",
        "orang-asing-tinggal-terbatas",
    ],
    "Jenis permohonan wajib dipilih"
);

export const klasifikasiPindahSchema = z.enum(
    [
        "dalam-satu-kalurahan",
        "antar-kalurahan-satu-kapanewon",
        "antar-kapanewon-satu-kabupaten",
        "antar-kabupaten-satu-provinsi",
        "antar-provinsi",
    ],
    "Klasifikasi pindah wajib dipilih"
);

export const alasanPindahSchema = z.enum(
    ["pekerjaan", "pendidikan", "keamanan", "kesehatan", "perumahan", "keluarga", "lainnya"],
    "Alasan pindah wajib dipilih"
);

export const jenisKepindahanSchema = z.enum(
    [
        "kepala-keluarga",
        "kepala-keluarga-dan-sebagian-anggota",
        "kepala-keluarga-dan-seluruh-anggota",
        "anggota-keluarga",
    ],
    "Jenis kepindahan wajib dipilih"
);

export const statusKkSchema = z.enum(
    ["numpang-kk", "membuat-kk-baru"],
    "Status KK wajib dipilih"
);


const anggotaPindahSchema = z.object({
    nik: nikSchema,
    namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    shdk: shdkSchema,
});

const alamatTujuanSchema = z.object({
    alamat: z.string().min(1, "Alamat tujuan wajib diisi"),
    rt: z.string().regex(/^\d{1,3}$/, "RT harus berupa angka"),
    rw: z.string().regex(/^\d{1,3}$/, "RW harus berupa angka"),
    kalurahan: z.string().min(1, "Kalurahan tujuan wajib diisi"),
    kapanewon: z.string().min(1, "Kapanewon tujuan wajib diisi"),
    kabupaten: z.string().min(1, "Kabupaten tujuan wajib diisi"),
    provinsi: z.string().min(1, "Provinsi tujuan wajib diisi"),
    kodePos: z.string().min(1, "Kode pos tujuan wajib diisi"),
});

export const pindahDomisiliSchema = z
    .object({
        namaPengaju: z.string().min(1, "Nama pengaju wajib diisi"),
        noKK: noKkSchema,
        namaPemohon: z.string().min(1, "Nama wajib diisi"),
        nikPemohon: nikSchema,
        jenisPermohonan: jenisPermohonanPindahSchema,

        alamatAsal: alamatSchema,
        kodePosAsal: z.string().min(1, "Kode pos wajib diisi"),
        klasifikasiPindah: klasifikasiPindahSchema,

        alamatTujuan: alamatTujuanSchema,

        alasanPindah: alasanPindahSchema,
        alasanPindahLainnya: z.string().optional(),
        keteranganPekerjaan: z.string().optional(),

        jenisKepindahan: jenisKepindahanSchema,
        statusKKTidakPindah: statusKkSchema,
        statusKKPindah: statusKkSchema,
        daftarAnggotaPindah: z
            .array(anggotaPindahSchema)
            .min(1, "Minimal 1 anggota yang pindah harus diisi"),
        rencanaPindahTanggal: z.iso.date("Tanggal rencana pindah tidak valid"),

        // Blok orang asing -- hanya untuk jenisPermohonan tempat-tinggal /
        // tinggal-terbatas.
        namaSponsor: z.string().optional(),
        tipeSponsor: tipeSponsorSchema.optional().or(z.literal("")),
        alamatSponsor: z.string().optional(),
        nomorKitasKitap: z.string().optional(),
        tanggalMasaBerlakuKitas: z.iso
            .date("Tanggal masa berlaku tidak valid")
            .optional()
            .or(z.literal("")),

        // Blok pindah luar negeri -- hanya untuk jenisPermohonan
        // surat-keterangan-pindah-luar-negeri.
        negaraTujuan: z.string().optional(),
        kodeNegara: z.string().optional(),
        alamatTujuanLuarNegeri: z.string().optional(),
        penanggungJawab: z.string().optional(),
    })
    .superRefine((values, ctx) => {
        if (values.alasanPindah === "lainnya" && !values.alasanPindahLainnya?.trim()) {
            ctx.addIssue({
                code: "custom",
                message: "Alasan pindah lainnya wajib diisi",
                path: ["alasanPindahLainnya"],
            });
        }

        const butuhDataOrangAsing =
            values.jenisPermohonan === "surat-keterangan-tempat-tinggal" ||
            values.jenisPermohonan === "orang-asing-tinggal-terbatas";
        if (butuhDataOrangAsing) {
            if (!values.namaSponsor?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nama sponsor wajib diisi",
                    path: ["namaSponsor"],
                });
            }
            if (!values.tipeSponsor) {
                ctx.addIssue({
                    code: "custom",
                    message: "Tipe sponsor wajib dipilih",
                    path: ["tipeSponsor"],
                });
            }
            if (!values.nomorKitasKitap?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nomor KITAS/KITAP wajib diisi",
                    path: ["nomorKitasKitap"],
                });
            }
        }

        if (values.jenisPermohonan === "surat-keterangan-pindah-luar-negeri") {
            if (!values.negaraTujuan?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Negara tujuan wajib diisi",
                    path: ["negaraTujuan"],
                });
            }
            if (!values.alamatTujuanLuarNegeri?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    message: "Alamat tujuan di luar negeri wajib diisi",
                    path: ["alamatTujuanLuarNegeri"],
                });
            }
        }
    });

export type PindahDomisiliFormValues = z.infer<typeof pindahDomisiliSchema>;
export type PindahDomisiliFormInput = z.input<typeof pindahDomisiliSchema>;
