"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/forms/field";
import { FormSection } from "@/components/forms/form-section";
import { TicketResult } from "@/components/forms/ticket-result";
import { PadukuhanSelect } from "@/components/forms/padukuhan-select";
import { JenisKelaminRadio } from "@/components/forms/jenis-kelamin-radio";
import { KewarganegaraanRadio } from "@/components/forms/kewarganegaraan-radio";
import { ShdkSelect } from "@/components/forms/shdk-select";
import {
    biodataKeluargaSchema,
    WILAYAH_TETAP_BDK,
    type AnggotaKeluargaBdkInput,
    type BiodataKeluargaFormInput,
} from "@/lib/validations/biodata-keluarga.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("biodata-keluarga")!;

const ANGGOTA_KOSONG: AnggotaKeluargaBdkInput = {
    namaLengkap: "",
    gelarDepan: "",
    gelarBelakang: "",
    nomorPaspor: "",
    tanggalBerakhirPaspor: "",
    namaSponsor: "",
    tipeSponsor: "",
    alamatSponsor: "",
    jenisKelamin: "" as AnggotaKeluargaBdkInput["jenisKelamin"],
    tempatLahir: "",
    tanggalLahir: "",
    kewarganegaraan: "wni",
    nomorSKPenetapanWNI: "",
    punyaAktaLahir: false,
    nomorAktaKelahiran: "",
    golonganDarah: "",
    agama: "" as AnggotaKeluargaBdkInput["agama"],
    namaOrganisasiKepercayaan: "",
    statusPerkawinan: "" as AnggotaKeluargaBdkInput["statusPerkawinan"],
    punyaAktaPerkawinan: false,
    nomorAktaPerkawinan: "",
    tanggalPerkawinan: "",
    punyaAktaCerai: false,
    nomorAktaPerceraian: "",
    tanggalPerceraian: "",
    shdk: "" as AnggotaKeluargaBdkInput["shdk"],
    kelainanFisikMental: "",
    penyandangCacat: "",
    pendidikanTerakhir: "" as AnggotaKeluargaBdkInput["pendidikanTerakhir"],
    jenisPekerjaan: "",
    nomorItasItap: "",
    tempatTerbitItasItap: "",
    tanggalTerbitItasItap: "",
    tanggalAkhirItasItap: "",
    tempatDatangPertama: "",
    tanggalKedatanganPertama: "",
    nikIbu: "",
    namaIbu: "",
    nikAyah: "",
    namaAyah: "",
};

// Kolom formulir F-1.01 asli yang aktif per jenisInput -- dipakai untuk
// menyembunyikan field yang tidak relevan (bukan cuma disable).
const RENTANG_KOLOM: Record<string, Array<[number, number]>> = {
    wni: [
        [2, 6],
        [10, 31],
        [38, 41],
    ],
    "orang-asing": [
        [2, 13],
        [15, 41],
    ],
    "wni-luar-negeri": [
        [2, 31],
        [38, 41],
    ],
};

function kolomAktif(jenisInput: string, kolom: number): boolean {
    const rentang = RENTANG_KOLOM[jenisInput];
    if (!rentang) return false;
    return rentang.some(([awal, akhir]) => kolom >= awal && kolom <= akhir);
}

function AgamaSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih agama" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="islam">Islam</SelectItem>
                <SelectItem value="kristen">Kristen</SelectItem>
                <SelectItem value="katholik">Katholik</SelectItem>
                <SelectItem value="hindu">Hindu</SelectItem>
                <SelectItem value="buddha">Buddha</SelectItem>
                <SelectItem value="konghucu">Konghucu</SelectItem>
            </SelectContent>
        </Select>
    );
}

function StatusPerkawinanSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="belum-kawin">Belum Kawin</SelectItem>
                <SelectItem value="kawin">Kawin</SelectItem>
                <SelectItem value="cerai-hidup">Cerai Hidup</SelectItem>
                <SelectItem value="cerai-mati">Cerai Mati</SelectItem>
            </SelectContent>
        </Select>
    );
}

function PendidikanSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih pendidikan" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="tidak-sekolah">Tidak Sekolah</SelectItem>
                <SelectItem value="sd">SD</SelectItem>
                <SelectItem value="smp">SMP</SelectItem>
                <SelectItem value="sma">SMA</SelectItem>
                <SelectItem value="d3">D3</SelectItem>
                <SelectItem value="s1">S1</SelectItem>
                <SelectItem value="s2">S2</SelectItem>
                <SelectItem value="s3">S3</SelectItem>
            </SelectContent>
        </Select>
    );
}

function GolonganDarahSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih golongan darah" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="a">A</SelectItem>
                <SelectItem value="b">B</SelectItem>
                <SelectItem value="ab">AB</SelectItem>
                <SelectItem value="o">O</SelectItem>
                <SelectItem value="a-plus">A+</SelectItem>
                <SelectItem value="a-minus">A-</SelectItem>
                <SelectItem value="b-plus">B+</SelectItem>
                <SelectItem value="b-minus">B-</SelectItem>
                <SelectItem value="ab-plus">AB+</SelectItem>
                <SelectItem value="ab-minus">AB-</SelectItem>
                <SelectItem value="o-plus">O+</SelectItem>
                <SelectItem value="o-minus">O-</SelectItem>
                <SelectItem value="tidak-tahu">Tidak Tahu</SelectItem>
            </SelectContent>
        </Select>
    );
}

function TipeSponsorSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
        <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih tipe sponsor" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="organisasi">Organisasi</SelectItem>
                <SelectItem value="pemerintah">Pemerintah</SelectItem>
                <SelectItem value="perorangan">Perorangan</SelectItem>
                <SelectItem value="tanpa-sponsor">Tanpa Sponsor</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default function BiodataKeluargaFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [stepIndex, setStepIndex] = useState(0);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<BiodataKeluargaFormInput>({
        resolver: zodResolver(biodataKeluargaSchema),
        defaultValues: {
            namaPengaju: "",
            jenisInput: "" as BiodataKeluargaFormInput["jenisInput"],
            namaKepalaKeluarga: "",
            alamat: { padukuhan: "" as BiodataKeluargaFormInput["alamat"]["padukuhan"], rt: "", rw: "" },
            kodePos: "55881",
            jumlahAnggotaKeluarga: 1,
            telepon: "",
            email: "",
            alamatLuarNegeri: "",
            kotaLuarNegeri: "",
            provinsiNegaraBagian: "",
            negara: "",
            kodePosLuarNegeri: "",
            teleponLuarNegeri: "",
            emailLuarNegeri: "",
            anggotaKeluarga: [ANGGOTA_KOSONG],
        },
    });

    const jenisInput = watch("jenisInput");
    const jumlahAnggotaKeluarga = watch("jumlahAnggotaKeluarga");
    const { fields, append, remove } = useFieldArray({ control, name: "anggotaKeluarga" });

    // Sinkronkan jumlah baris anggotaKeluarga dengan jumlahAnggotaKeluarga yang diisi.
    useEffect(() => {
        const target = Math.min(Math.max(Number(jumlahAnggotaKeluarga) || 1, 1), 10);
        if (target > fields.length) {
            for (let i = fields.length; i < target; i++) append(ANGGOTA_KOSONG);
        } else if (target < fields.length) {
            for (let i = fields.length - 1; i >= target; i--) remove(i);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jumlahAnggotaKeluarga]);

    const jumlahAnggota = fields.length;
    const totalStep = 2 + jumlahAnggota + 1; // jenis input + kepala keluarga + N anggota + review
    const stepTerakhir = totalStep - 1;

    function salinDariSebelumnya(index: number) {
        if (index === 0) return;
        const sebelumnya = getValues(`anggotaKeluarga.${index - 1}`);
        setValue(`anggotaKeluarga.${index}.namaIbu`, sebelumnya.namaIbu);
        setValue(`anggotaKeluarga.${index}.nikIbu`, sebelumnya.nikIbu);
        setValue(`anggotaKeluarga.${index}.namaAyah`, sebelumnya.namaAyah);
        setValue(`anggotaKeluarga.${index}.nikAyah`, sebelumnya.nikAyah);
    }

    async function lanjutKeStep(next: number) {
        let namaFieldDivalidasi: (keyof BiodataKeluargaFormInput | `anggotaKeluarga.${number}`)[] = [];

        if (stepIndex === 0) {
            namaFieldDivalidasi = ["jenisInput"];
        } else if (stepIndex === 1) {
            namaFieldDivalidasi = ["namaKepalaKeluarga", "alamat", "kodePos", "jumlahAnggotaKeluarga"];
            if (jenisInput === "wni-luar-negeri") {
                namaFieldDivalidasi.push("alamatLuarNegeri", "kotaLuarNegeri", "negara");
            }
        } else if (stepIndex >= 2 && stepIndex < 2 + jumlahAnggota) {
            const indexAnggota = stepIndex - 2;
            namaFieldDivalidasi = [`anggotaKeluarga.${indexAnggota}`];
        }

        const valid = await trigger(namaFieldDivalidasi as never);
        if (valid) setStepIndex(next);
    }

    async function onSubmit(values: BiodataKeluargaFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({ jenisSurat: "biodata-keluarga", data: values });
            setNomorTiket(nomorTiket);
        } catch {
            setSubmitError("Gagal mengirim pengajuan. Periksa koneksi internet Anda dan coba lagi.");
        }
    }

    if (nomorTiket) {
        return (
            <div className="mx-auto w-full max-w-3xl px-4 py-12">
                <TicketResult nomorTiket={nomorTiket} jenisSurat={jenisSurat} />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-12">
            <Card>
                <CardHeader>
                    <CardTitle>{jenisSurat.nama}</CardTitle>
                    <CardDescription>{jenisSurat.deskripsi}</CardDescription>
                    <div className="mt-3 flex flex-col gap-1.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${((stepIndex + 1) / totalStep) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Langkah {stepIndex + 1} dari {totalStep}
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {stepIndex === 0 && (
                            <FormSection
                                title="Data Pengaju & Jenis Input"
                                description="Warga yang mengisi formulir ini secara online, boleh sama dengan kepala keluarga di bawah."
                            >
                                <Field
                                    label="Nama Pengaju"
                                    htmlFor="namaPengaju"
                                    error={errors.namaPengaju?.message}
                                    className="sm:col-span-2"
                                >
                                    <Input id="namaPengaju" {...register("namaPengaju")} />
                                </Field>
                                <Field
                                    label="Jenis Input"
                                    htmlFor="jenisInput"
                                    error={errors.jenisInput?.message}
                                    className="sm:col-span-2"
                                >
                                    <Controller
                                        name="jenisInput"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={(next) => field.onChange(next ?? "")}
                                            >
                                                <SelectTrigger id="jenisInput" className="w-full">
                                                    <SelectValue placeholder="Pilih jenis input" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="wni">WNI</SelectItem>
                                                    <SelectItem value="orang-asing">Orang Asing</SelectItem>
                                                    <SelectItem value="wni-luar-negeri">
                                                        WNI dari Luar Negeri
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                            </FormSection>
                        )}

                        {stepIndex === 1 && (
                            <>
                                <FormSection title="Data Kepala Keluarga">
                                    <Field
                                        label="Nama Kepala Keluarga"
                                        htmlFor="namaKepalaKeluarga"
                                        error={errors.namaKepalaKeluarga?.message}
                                        hint="Harus sama persis dengan nama salah satu anggota berstatus Kepala Keluarga"
                                        className="sm:col-span-2"
                                    >
                                        <Input id="namaKepalaKeluarga" {...register("namaKepalaKeluarga")} />
                                    </Field>
                                    <Field
                                        label="Jumlah Anggota Keluarga"
                                        htmlFor="jumlahAnggotaKeluarga"
                                        error={errors.jumlahAnggotaKeluarga?.message}
                                    >
                                        <Input
                                            id="jumlahAnggotaKeluarga"
                                            type="number"
                                            min={1}
                                            max={10}
                                            {...register("jumlahAnggotaKeluarga")}
                                        />
                                    </Field>
                                    <Field label="Telepon" htmlFor="telepon" hint="Opsional">
                                        <Input id="telepon" {...register("telepon")} />
                                    </Field>
                                    <Field
                                        label="Email"
                                        htmlFor="email"
                                        hint="Opsional"
                                        error={errors.email?.message}
                                    >
                                        <Input id="email" type="email" {...register("email")} />
                                    </Field>
                                </FormSection>

                                <FormSection
                                    title="Alamat"
                                    description="Kode wilayah lengkap (provinsi/kabupaten/kecamatan/kelurahan) diisi petugas Dukcapil."
                                >
                                    <Field
                                        label="Padukuhan (Nama Dusun/Dukuh)"
                                        htmlFor="alamat.padukuhan"
                                        error={errors.alamat?.padukuhan?.message}
                                    >
                                        <Controller
                                            name="alamat.padukuhan"
                                            control={control}
                                            render={({ field }) => (
                                                <PadukuhanSelect
                                                    id="alamat.padukuhan"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </Field>
                                    <Field label="Kode Pos" htmlFor="kodePos" error={errors.kodePos?.message}>
                                        <Input id="kodePos" inputMode="numeric" maxLength={5} {...register("kodePos")} />
                                    </Field>
                                    <Field label="RT" htmlFor="alamat.rt" error={errors.alamat?.rt?.message}>
                                        <Input id="alamat.rt" inputMode="numeric" maxLength={2} {...register("alamat.rt")} />
                                    </Field>
                                    <Field label="RW" htmlFor="alamat.rw" error={errors.alamat?.rw?.message}>
                                        <Input id="alamat.rw" inputMode="numeric" maxLength={2} {...register("alamat.rw")} />
                                    </Field>
                                    <p className="text-xs text-muted-foreground sm:col-span-2">
                                        Provinsi: {WILAYAH_TETAP_BDK.provinsi} &middot; Kabupaten:{" "}
                                        {WILAYAH_TETAP_BDK.kabupaten} &middot; Kecamatan:{" "}
                                        {WILAYAH_TETAP_BDK.kecamatan} &middot; Kelurahan:{" "}
                                        {WILAYAH_TETAP_BDK.kelurahan}
                                    </p>
                                </FormSection>

                                {jenisInput === "wni-luar-negeri" && (
                                    <FormSection
                                        title="Alamat di Luar Negeri"
                                        description="Kode negara dan kode perwakilan RI diisi petugas Dukcapil."
                                    >
                                        <Field
                                            label="Alamat"
                                            htmlFor="alamatLuarNegeri"
                                            error={errors.alamatLuarNegeri?.message}
                                            className="sm:col-span-2"
                                        >
                                            <Input id="alamatLuarNegeri" {...register("alamatLuarNegeri")} />
                                        </Field>
                                        <Field
                                            label="Kota"
                                            htmlFor="kotaLuarNegeri"
                                            error={errors.kotaLuarNegeri?.message}
                                        >
                                            <Input id="kotaLuarNegeri" {...register("kotaLuarNegeri")} />
                                        </Field>
                                        <Field
                                            label="Provinsi/Negara Bagian"
                                            htmlFor="provinsiNegaraBagian"
                                            hint="Opsional"
                                        >
                                            <Input id="provinsiNegaraBagian" {...register("provinsiNegaraBagian")} />
                                        </Field>
                                        <Field label="Negara" htmlFor="negara" error={errors.negara?.message}>
                                            <Input id="negara" {...register("negara")} />
                                        </Field>
                                        <Field label="Kode Pos" htmlFor="kodePosLuarNegeri" hint="Opsional">
                                            <Input id="kodePosLuarNegeri" {...register("kodePosLuarNegeri")} />
                                        </Field>
                                        <Field label="Telepon" htmlFor="teleponLuarNegeri" hint="Opsional">
                                            <Input id="teleponLuarNegeri" {...register("teleponLuarNegeri")} />
                                        </Field>
                                        <Field
                                            label="Email"
                                            htmlFor="emailLuarNegeri"
                                            hint="Opsional"
                                            error={errors.emailLuarNegeri?.message}
                                        >
                                            <Input id="emailLuarNegeri" type="email" {...register("emailLuarNegeri")} />
                                        </Field>
                                    </FormSection>
                                )}
                            </>
                        )}

                        {stepIndex >= 2 &&
                            stepIndex < 2 + jumlahAnggota &&
                            (() => {
                                const index = stepIndex - 2;
                                const errAnggota = errors.anggotaKeluarga?.[index];
                                const p = <K extends keyof AnggotaKeluargaBdkInput>(nama: K) =>
                                    `anggotaKeluarga.${index}.${nama}` as const;
                                return (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-heading text-sm font-semibold">
                                                Anggota Keluarga {index + 1} dari {jumlahAnggota}
                                            </h3>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => salinDariSebelumnya(index)}
                                                >
                                                    <Copy />
                                                    Salin alamat & data orang tua dari anggota sebelumnya
                                                </Button>
                                            )}
                                        </div>

                                        <FormSection title="Identitas">
                                            <Field
                                                label="Nama Lengkap"
                                                htmlFor={p("namaLengkap")}
                                                error={errAnggota?.namaLengkap?.message}
                                            >
                                                <Input id={p("namaLengkap")} {...register(p("namaLengkap"))} />
                                            </Field>
                                            {kolomAktif(jenisInput, 3) && (
                                                <Field label="Gelar Depan" htmlFor={p("gelarDepan")} hint="Opsional">
                                                    <Input id={p("gelarDepan")} {...register(p("gelarDepan"))} />
                                                </Field>
                                            )}
                                            {kolomAktif(jenisInput, 4) && (
                                                <Field label="Gelar Belakang" htmlFor={p("gelarBelakang")} hint="Opsional">
                                                    <Input id={p("gelarBelakang")} {...register(p("gelarBelakang"))} />
                                                </Field>
                                            )}
                                            {kolomAktif(jenisInput, 5) && (
                                                <Field label="Nomor Paspor" htmlFor={p("nomorPaspor")} hint="Opsional">
                                                    <Input id={p("nomorPaspor")} {...register(p("nomorPaspor"))} />
                                                </Field>
                                            )}
                                            {kolomAktif(jenisInput, 6) && (
                                                <Field
                                                    label="Tanggal Berakhir Paspor"
                                                    htmlFor={p("tanggalBerakhirPaspor")}
                                                    hint="Opsional"
                                                >
                                                    <Input
                                                        id={p("tanggalBerakhirPaspor")}
                                                        type="date"
                                                        {...register(p("tanggalBerakhirPaspor"))}
                                                    />
                                                </Field>
                                            )}
                                            <Field
                                                label="Jenis Kelamin"
                                                htmlFor={p("jenisKelamin")}
                                                error={errAnggota?.jenisKelamin?.message}
                                            >
                                                <Controller
                                                    name={p("jenisKelamin")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <JenisKelaminRadio
                                                            id={p("jenisKelamin")}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Field>
                                            <Field
                                                label="Tempat Lahir"
                                                htmlFor={p("tempatLahir")}
                                                error={errAnggota?.tempatLahir?.message}
                                            >
                                                <Input id={p("tempatLahir")} {...register(p("tempatLahir"))} />
                                            </Field>
                                            <Field
                                                label="Tanggal Lahir"
                                                htmlFor={p("tanggalLahir")}
                                                error={errAnggota?.tanggalLahir?.message}
                                            >
                                                <Input id={p("tanggalLahir")} type="date" {...register(p("tanggalLahir"))} />
                                            </Field>
                                            <Field
                                                label="Kewarganegaraan"
                                                htmlFor={p("kewarganegaraan")}
                                                error={errAnggota?.kewarganegaraan?.message}
                                            >
                                                <Controller
                                                    name={p("kewarganegaraan")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <KewarganegaraanRadio
                                                            id={p("kewarganegaraan")}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Field>
                                            {kolomAktif(jenisInput, 14) && (
                                                <Field
                                                    label="Nomor SK Penetapan WNI"
                                                    htmlFor={p("nomorSKPenetapanWNI")}
                                                    hint="Opsional"
                                                >
                                                    <Input
                                                        id={p("nomorSKPenetapanWNI")}
                                                        {...register(p("nomorSKPenetapanWNI"))}
                                                    />
                                                </Field>
                                            )}
                                        </FormSection>

                                        {kolomAktif(jenisInput, 7) && (
                                            <FormSection
                                                title="Data Sponsor"
                                                description="Untuk orang asing."
                                            >
                                                <Field
                                                    label="Nama Sponsor"
                                                    htmlFor={p("namaSponsor")}
                                                    error={errAnggota?.namaSponsor?.message}
                                                >
                                                    <Input id={p("namaSponsor")} {...register(p("namaSponsor"))} />
                                                </Field>
                                                <Field
                                                    label="Tipe Sponsor"
                                                    htmlFor={p("tipeSponsor")}
                                                    error={errAnggota?.tipeSponsor?.message}
                                                >
                                                    <Controller
                                                        name={p("tipeSponsor")}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TipeSponsorSelect
                                                                id={p("tipeSponsor")}
                                                                value={field.value ?? ""}
                                                                onChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                </Field>
                                                <Field
                                                    label="Alamat Sponsor"
                                                    htmlFor={p("alamatSponsor")}
                                                    error={errAnggota?.alamatSponsor?.message}
                                                    className="sm:col-span-2"
                                                >
                                                    <Input id={p("alamatSponsor")} {...register(p("alamatSponsor"))} />
                                                </Field>
                                            </FormSection>
                                        )}

                                        <FormSection title="Dokumen Kelahiran, Perkawinan, Perceraian">
                                            <Field label="Punya Akta Lahir?" htmlFor={p("punyaAktaLahir")}>
                                                <Controller
                                                    name={p("punyaAktaLahir")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? "ya" : "tidak"}
                                                            onValueChange={(v) => field.onChange(v === "ya")}
                                                        >
                                                            <SelectTrigger id={p("punyaAktaLahir")} className="w-full">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ya">Ya</SelectItem>
                                                                <SelectItem value="tidak">Tidak</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </Field>
                                            {watch(p("punyaAktaLahir")) && (
                                                <Field
                                                    label="Nomor Akta Kelahiran"
                                                    htmlFor={p("nomorAktaKelahiran")}
                                                    error={errAnggota?.nomorAktaKelahiran?.message}
                                                >
                                                    <Input
                                                        id={p("nomorAktaKelahiran")}
                                                        {...register(p("nomorAktaKelahiran"))}
                                                    />
                                                </Field>
                                            )}

                                            <Field label="Punya Akta Perkawinan?" htmlFor={p("punyaAktaPerkawinan")}>
                                                <Controller
                                                    name={p("punyaAktaPerkawinan")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? "ya" : "tidak"}
                                                            onValueChange={(v) => field.onChange(v === "ya")}
                                                        >
                                                            <SelectTrigger
                                                                id={p("punyaAktaPerkawinan")}
                                                                className="w-full"
                                                            >
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ya">Ya</SelectItem>
                                                                <SelectItem value="tidak">Tidak</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </Field>
                                            <div />
                                            {watch(p("punyaAktaPerkawinan")) && (
                                                <>
                                                    <Field
                                                        label="Nomor Akta Perkawinan"
                                                        htmlFor={p("nomorAktaPerkawinan")}
                                                        error={errAnggota?.nomorAktaPerkawinan?.message}
                                                    >
                                                        <Input
                                                            id={p("nomorAktaPerkawinan")}
                                                            {...register(p("nomorAktaPerkawinan"))}
                                                        />
                                                    </Field>
                                                    <Field
                                                        label="Tanggal Perkawinan"
                                                        htmlFor={p("tanggalPerkawinan")}
                                                        error={errAnggota?.tanggalPerkawinan?.message}
                                                    >
                                                        <Input
                                                            id={p("tanggalPerkawinan")}
                                                            type="date"
                                                            {...register(p("tanggalPerkawinan"))}
                                                        />
                                                    </Field>
                                                </>
                                            )}

                                            <Field label="Punya Akta Cerai?" htmlFor={p("punyaAktaCerai")}>
                                                <Controller
                                                    name={p("punyaAktaCerai")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? "ya" : "tidak"}
                                                            onValueChange={(v) => field.onChange(v === "ya")}
                                                        >
                                                            <SelectTrigger id={p("punyaAktaCerai")} className="w-full">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ya">Ya</SelectItem>
                                                                <SelectItem value="tidak">Tidak</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </Field>
                                            <div />
                                            {watch(p("punyaAktaCerai")) && (
                                                <>
                                                    <Field
                                                        label="Nomor Akta Perceraian"
                                                        htmlFor={p("nomorAktaPerceraian")}
                                                        error={errAnggota?.nomorAktaPerceraian?.message}
                                                    >
                                                        <Input
                                                            id={p("nomorAktaPerceraian")}
                                                            {...register(p("nomorAktaPerceraian"))}
                                                        />
                                                    </Field>
                                                    <Field
                                                        label="Tanggal Perceraian"
                                                        htmlFor={p("tanggalPerceraian")}
                                                        error={errAnggota?.tanggalPerceraian?.message}
                                                    >
                                                        <Input
                                                            id={p("tanggalPerceraian")}
                                                            type="date"
                                                            {...register(p("tanggalPerceraian"))}
                                                        />
                                                    </Field>
                                                </>
                                            )}
                                        </FormSection>

                                        <FormSection title="Kependudukan Lainnya">
                                            {kolomAktif(jenisInput, 17) && (
                                                <Field label="Golongan Darah" htmlFor={p("golonganDarah")} hint="Opsional">
                                                    <Controller
                                                        name={p("golonganDarah")}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <GolonganDarahSelect
                                                                id={p("golonganDarah")}
                                                                value={field.value ?? ""}
                                                                onChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                </Field>
                                            )}
                                            <Field
                                                label="Agama"
                                                htmlFor={p("agama")}
                                                error={errAnggota?.agama?.message}
                                            >
                                                <Controller
                                                    name={p("agama")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <AgamaSelect
                                                            id={p("agama")}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Field>
                                            <Field
                                                label="Nama Organisasi Kepercayaan"
                                                htmlFor={p("namaOrganisasiKepercayaan")}
                                                hint="Opsional"
                                            >
                                                <Input
                                                    id={p("namaOrganisasiKepercayaan")}
                                                    {...register(p("namaOrganisasiKepercayaan"))}
                                                />
                                            </Field>
                                            <Field
                                                label="Status Perkawinan"
                                                htmlFor={p("statusPerkawinan")}
                                                error={errAnggota?.statusPerkawinan?.message}
                                            >
                                                <Controller
                                                    name={p("statusPerkawinan")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <StatusPerkawinanSelect
                                                            id={p("statusPerkawinan")}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Field>
                                            <Field
                                                label="Status Hubungan dalam Keluarga"
                                                htmlFor={p("shdk")}
                                                error={errAnggota?.shdk?.message}
                                            >
                                                <Controller
                                                    name={p("shdk")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ShdkSelect
                                                            id={p("shdk")}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Field>
                                            <Field
                                                label="Kelainan Fisik/Mental"
                                                htmlFor={p("kelainanFisikMental")}
                                                hint="Opsional"
                                            >
                                                <Input
                                                    id={p("kelainanFisikMental")}
                                                    {...register(p("kelainanFisikMental"))}
                                                />
                                            </Field>
                                            <Field
                                                label="Penyandang Cacat"
                                                htmlFor={p("penyandangCacat")}
                                                hint="Opsional"
                                            >
                                                <Input id={p("penyandangCacat")} {...register(p("penyandangCacat"))} />
                                            </Field>
                                            <Field
                                                label="Pendidikan Terakhir"
                                                htmlFor={p("pendidikanTerakhir")}
                                                error={errAnggota?.pendidikanTerakhir?.message}
                                            >
                                                <Controller
                                                    name={p("pendidikanTerakhir")}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <PendidikanSelect
                                                            id={p("pendidikanTerakhir")}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Field>
                                            <Field
                                                label="Jenis Pekerjaan"
                                                htmlFor={p("jenisPekerjaan")}
                                                error={errAnggota?.jenisPekerjaan?.message}
                                            >
                                                <Input id={p("jenisPekerjaan")} {...register(p("jenisPekerjaan"))} />
                                            </Field>
                                        </FormSection>

                                        {kolomAktif(jenisInput, 32) && (
                                            <FormSection
                                                title="Dokumen Izin Tinggal"
                                                description="Untuk orang asing."
                                            >
                                                <Field
                                                    label="Nomor ITAS/ITAP"
                                                    htmlFor={p("nomorItasItap")}
                                                    error={errAnggota?.nomorItasItap?.message}
                                                >
                                                    <Input id={p("nomorItasItap")} {...register(p("nomorItasItap"))} />
                                                </Field>
                                                <Field
                                                    label="Tempat Terbit ITAS/ITAP"
                                                    htmlFor={p("tempatTerbitItasItap")}
                                                    error={errAnggota?.tempatTerbitItasItap?.message}
                                                >
                                                    <Input
                                                        id={p("tempatTerbitItasItap")}
                                                        {...register(p("tempatTerbitItasItap"))}
                                                    />
                                                </Field>
                                                <Field
                                                    label="Tanggal Terbit ITAS/ITAP"
                                                    htmlFor={p("tanggalTerbitItasItap")}
                                                    hint="Opsional"
                                                >
                                                    <Input
                                                        id={p("tanggalTerbitItasItap")}
                                                        type="date"
                                                        {...register(p("tanggalTerbitItasItap"))}
                                                    />
                                                </Field>
                                                <Field
                                                    label="Tanggal Akhir ITAS/ITAP"
                                                    htmlFor={p("tanggalAkhirItasItap")}
                                                    hint="Opsional"
                                                >
                                                    <Input
                                                        id={p("tanggalAkhirItasItap")}
                                                        type="date"
                                                        {...register(p("tanggalAkhirItasItap"))}
                                                    />
                                                </Field>
                                                <Field
                                                    label="Tempat Datang Pertama"
                                                    htmlFor={p("tempatDatangPertama")}
                                                    error={errAnggota?.tempatDatangPertama?.message}
                                                >
                                                    <Input
                                                        id={p("tempatDatangPertama")}
                                                        {...register(p("tempatDatangPertama"))}
                                                    />
                                                </Field>
                                                <Field
                                                    label="Tanggal Kedatangan Pertama"
                                                    htmlFor={p("tanggalKedatanganPertama")}
                                                    hint="Opsional"
                                                >
                                                    <Input
                                                        id={p("tanggalKedatanganPertama")}
                                                        type="date"
                                                        {...register(p("tanggalKedatanganPertama"))}
                                                    />
                                                </Field>
                                            </FormSection>
                                        )}

                                        <FormSection title="Data Orang Tua">
                                            <Field
                                                label="NIK Ibu"
                                                htmlFor={p("nikIbu")}
                                                error={errAnggota?.nikIbu?.message}
                                            >
                                                <Input
                                                    id={p("nikIbu")}
                                                    inputMode="numeric"
                                                    maxLength={16}
                                                    {...register(p("nikIbu"))}
                                                />
                                            </Field>
                                            <Field
                                                label="Nama Ibu"
                                                htmlFor={p("namaIbu")}
                                                error={errAnggota?.namaIbu?.message}
                                            >
                                                <Input id={p("namaIbu")} {...register(p("namaIbu"))} />
                                            </Field>
                                            <Field
                                                label="NIK Ayah"
                                                htmlFor={p("nikAyah")}
                                                error={errAnggota?.nikAyah?.message}
                                            >
                                                <Input
                                                    id={p("nikAyah")}
                                                    inputMode="numeric"
                                                    maxLength={16}
                                                    {...register(p("nikAyah"))}
                                                />
                                            </Field>
                                            <Field
                                                label="Nama Ayah"
                                                htmlFor={p("namaAyah")}
                                                error={errAnggota?.namaAyah?.message}
                                            >
                                                <Input id={p("namaAyah")} {...register(p("namaAyah"))} />
                                            </Field>
                                        </FormSection>
                                    </>
                                );
                            })()}

                        {stepIndex === stepTerakhir && (
                            <FormSection
                                title="Tinjau Ulang"
                                description="Periksa kembali sebelum mengirim. Kembali ke langkah sebelumnya kalau ada yang perlu diperbaiki."
                            >
                                <div className="flex flex-col gap-2 text-sm sm:col-span-2">
                                    <p>
                                        <span className="text-muted-foreground">Jenis input:</span>{" "}
                                        {jenisInput}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">Kepala keluarga:</span>{" "}
                                        {getValues("namaKepalaKeluarga")}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">Jumlah anggota:</span>{" "}
                                        {jumlahAnggota}
                                    </p>
                                    <ul className="list-inside list-disc">
                                        {getValues("anggotaKeluarga").map((anggota, index) => (
                                            <li key={index}>
                                                {anggota.namaLengkap || `Anggota ${index + 1} (belum diisi)`} --{" "}
                                                {anggota.shdk || "SHDK belum dipilih"}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FormSection>
                        )}

                        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                        <div className="flex items-center justify-between gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={stepIndex === 0}
                                onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                            >
                                Kembali
                            </Button>
                            {stepIndex < stepTerakhir ? (
                                <Button type="button" onClick={() => lanjutKeStep(stepIndex + 1)}>
                                    Lanjut
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
