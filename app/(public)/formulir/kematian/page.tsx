"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { JenisKelaminRadio } from "@/components/forms/jenis-kelamin-radio";
import { PadukuhanSelect } from "@/components/forms/padukuhan-select";
import { KewarganegaraanRadio } from "@/components/forms/kewarganegaraan-radio";
import { kematianSchema, type KematianFormInput } from "@/lib/validations/kematian.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("kematian")!;

export default function KematianFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<KematianFormInput>({
        resolver: zodResolver(kematianSchema),
        defaultValues: {
            nikAlmarhum: "",
            namaAlmarhum: "",
            tempatLahirAlmarhum: "",
            tanggalLahirAlmarhum: "",
            umurAlmarhum: 0,
            jenisKelaminAlmarhum: "" as KematianFormInput["jenisKelaminAlmarhum"],
            anakKeAlmarhum: undefined,
            alamatTerakhirAlmarhum: {
                padukuhan: "" as KematianFormInput["alamatTerakhirAlmarhum"]["padukuhan"],
                rt: "",
                rw: "",
            },
            tanggalKematian: "",
            pukulKematian: "",
            sebabKematian: "" as KematianFormInput["sebabKematian"],
            tempatKematian: "",
            yangMenerangkan: "" as KematianFormInput["yangMenerangkan"],
            namaAyah: "",
            nikAyah: "",
            tempatLahirAyah: "",
            tanggalLahirAyah: "",
            umurAyah: 0,
            kewarganegaraanAyah: "wni",
            pekerjaanAyah: "",
            alamatAyah: {
                padukuhan: "" as KematianFormInput["alamatAyah"]["padukuhan"],
                rt: "",
                rw: "",
            },
            namaIbu: "",
            nikIbu: "",
            tempatLahirIbu: "",
            tanggalLahirIbu: "",
            umurIbu: 0,
            kewarganegaraanIbu: "wni",
            pekerjaanIbu: "",
            alamatIbu: {
                padukuhan: "" as KematianFormInput["alamatIbu"]["padukuhan"],
                rt: "",
                rw: "",
            },
            tempatPerkawinan: "" as KematianFormInput["tempatPerkawinan"],
            tanggalPerkawinan: "",
            saksi1: { nama: "", nik: "", noKK: "", kewarganegaraan: "wni", umur: 0, pekerjaan: "", alamat: "" },
            saksi2: { nama: "", nik: "", noKK: "", kewarganegaraan: "wni", umur: 0, pekerjaan: "", alamat: "" },
            namaPelapor: "",
            nikPelapor: "",
            noKKPelapor: "",
            umurPelapor: 0,
            kewarganegaraanPelapor: "wni",
            pekerjaanPelapor: "",
            alamatPelapor: {
                padukuhan: "" as KematianFormInput["alamatPelapor"]["padukuhan"],
                rt: "",
                rw: "",
            },
            noHPPelapor: "",
        },
    });

    async function onSubmit(values: KematianFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({ jenisSurat: "kematian", data: values });
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
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormSection
                            title="Data Almarhum/Almarhumah"
                            description="Sesuai KTP/KK yang bersangkutan."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaAlmarhum"
                                error={errors.namaAlmarhum?.message}
                            >
                                <Input id="namaAlmarhum" {...register("namaAlmarhum")} />
                            </Field>
                            <Field
                                label="NIK"
                                htmlFor="nikAlmarhum"
                                error={errors.nikAlmarhum?.message}
                            >
                                <Input
                                    id="nikAlmarhum"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikAlmarhum")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirAlmarhum"
                                error={errors.tempatLahirAlmarhum?.message}
                            >
                                <Input id="tempatLahirAlmarhum" {...register("tempatLahirAlmarhum")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirAlmarhum"
                                error={errors.tanggalLahirAlmarhum?.message}
                            >
                                <Input
                                    id="tanggalLahirAlmarhum"
                                    type="date"
                                    {...register("tanggalLahirAlmarhum")}
                                />
                            </Field>
                            <Field label="Umur" htmlFor="umurAlmarhum" error={errors.umurAlmarhum?.message}>
                                <Input id="umurAlmarhum" type="number" {...register("umurAlmarhum")} />
                            </Field>
                            <Field
                                label="Jenis Kelamin"
                                htmlFor="jenisKelaminAlmarhum"
                                error={errors.jenisKelaminAlmarhum?.message}
                            >
                                <Controller
                                    name="jenisKelaminAlmarhum"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelaminAlmarhum"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Anak Ke"
                                htmlFor="anakKeAlmarhum"
                                hint="Opsional"
                                error={errors.anakKeAlmarhum?.message}
                            >
                                <Input id="anakKeAlmarhum" type="number" min={1} {...register("anakKeAlmarhum")} />
                            </Field>
                            <div />
                            <Field
                                label="Padukuhan (Alamat Terakhir)"
                                htmlFor="alamatTerakhirAlmarhum.padukuhan"
                                error={errors.alamatTerakhirAlmarhum?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatTerakhirAlmarhum.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatTerakhirAlmarhum.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatTerakhirAlmarhum.rt"
                                    error={errors.alamatTerakhirAlmarhum?.rt?.message}
                                >
                                    <Input
                                        id="alamatTerakhirAlmarhum.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatTerakhirAlmarhum.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatTerakhirAlmarhum.rw"
                                    error={errors.alamatTerakhirAlmarhum?.rw?.message}
                                >
                                    <Input
                                        id="alamatTerakhirAlmarhum.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatTerakhirAlmarhum.rw")}
                                    />
                                </Field>
                            </div>
                            <Field
                                label="Tanggal Kematian"
                                htmlFor="tanggalKematian"
                                error={errors.tanggalKematian?.message}
                            >
                                <Input
                                    id="tanggalKematian"
                                    type="date"
                                    {...register("tanggalKematian")}
                                />
                            </Field>
                            <Field
                                label="Pukul"
                                htmlFor="pukulKematian"
                                hint="Contoh: 14.30 WIB"
                                error={errors.pukulKematian?.message}
                            >
                                <Input id="pukulKematian" {...register("pukulKematian")} />
                            </Field>
                            <Field
                                label="Sebab Kematian"
                                htmlFor="sebabKematian"
                                error={errors.sebabKematian?.message}
                            >
                                <Controller
                                    name="sebabKematian"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="sebabKematian" className="w-full">
                                                <SelectValue placeholder="Pilih sebab" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sakit-tua">Sakit Biasa/Tua</SelectItem>
                                                <SelectItem value="wabah-penyakit">
                                                    Wabah Penyakit
                                                </SelectItem>
                                                <SelectItem value="kecelakaan">Kecelakaan</SelectItem>
                                                <SelectItem value="kriminalitas">Kriminalitas</SelectItem>
                                                <SelectItem value="bunuh-diri">Bunuh Diri</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Tempat Kematian"
                                htmlFor="tempatKematian"
                                error={errors.tempatKematian?.message}
                            >
                                <Input id="tempatKematian" {...register("tempatKematian")} />
                            </Field>
                            <Field
                                label="Yang Menerangkan"
                                htmlFor="yangMenerangkan"
                                error={errors.yangMenerangkan?.message}
                            >
                                <Controller
                                    name="yangMenerangkan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="yangMenerangkan" className="w-full">
                                                <SelectValue placeholder="Pilih pihak" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dokter">Dokter</SelectItem>
                                                <SelectItem value="tenaga-kesehatan">
                                                    Tenaga Kesehatan
                                                </SelectItem>
                                                <SelectItem value="kepolisian">Kepolisian</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Orang Tua Almarhum/Almarhumah"
                            description="Sesuai catatan sipil yang berlaku."
                        >
                            <Field label="Nama Ayah" htmlFor="namaAyah" error={errors.namaAyah?.message}>
                                <Input id="namaAyah" {...register("namaAyah")} />
                            </Field>
                            <Field label="NIK Ayah" htmlFor="nikAyah" error={errors.nikAyah?.message}>
                                <Input
                                    id="nikAyah"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikAyah")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir Ayah"
                                htmlFor="tempatLahirAyah"
                                error={errors.tempatLahirAyah?.message}
                            >
                                <Input id="tempatLahirAyah" {...register("tempatLahirAyah")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir Ayah"
                                htmlFor="tanggalLahirAyah"
                                error={errors.tanggalLahirAyah?.message}
                            >
                                <Input id="tanggalLahirAyah" type="date" {...register("tanggalLahirAyah")} />
                            </Field>
                            <Field label="Umur Ayah" htmlFor="umurAyah" error={errors.umurAyah?.message}>
                                <Input id="umurAyah" type="number" {...register("umurAyah")} />
                            </Field>
                            <Field
                                label="Kewarganegaraan Ayah"
                                htmlFor="kewarganegaraanAyah"
                                error={errors.kewarganegaraanAyah?.message}
                            >
                                <Controller
                                    name="kewarganegaraanAyah"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="kewarganegaraanAyah"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan Ayah"
                                htmlFor="pekerjaanAyah"
                                error={errors.pekerjaanAyah?.message}
                            >
                                <Input id="pekerjaanAyah" {...register("pekerjaanAyah")} />
                            </Field>
                            <div />
                            <Field
                                label="Padukuhan Ayah"
                                htmlFor="alamatAyah.padukuhan"
                                error={errors.alamatAyah?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatAyah.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatAyah.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="RT" htmlFor="alamatAyah.rt" error={errors.alamatAyah?.rt?.message}>
                                    <Input
                                        id="alamatAyah.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatAyah.rt")}
                                    />
                                </Field>
                                <Field label="RW" htmlFor="alamatAyah.rw" error={errors.alamatAyah?.rw?.message}>
                                    <Input
                                        id="alamatAyah.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatAyah.rw")}
                                    />
                                </Field>
                            </div>

                            <Field label="Nama Ibu" htmlFor="namaIbu" error={errors.namaIbu?.message}>
                                <Input id="namaIbu" {...register("namaIbu")} />
                            </Field>
                            <Field label="NIK Ibu" htmlFor="nikIbu" error={errors.nikIbu?.message}>
                                <Input
                                    id="nikIbu"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikIbu")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir Ibu"
                                htmlFor="tempatLahirIbu"
                                error={errors.tempatLahirIbu?.message}
                            >
                                <Input id="tempatLahirIbu" {...register("tempatLahirIbu")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir Ibu"
                                htmlFor="tanggalLahirIbu"
                                error={errors.tanggalLahirIbu?.message}
                            >
                                <Input id="tanggalLahirIbu" type="date" {...register("tanggalLahirIbu")} />
                            </Field>
                            <Field label="Umur Ibu" htmlFor="umurIbu" error={errors.umurIbu?.message}>
                                <Input id="umurIbu" type="number" {...register("umurIbu")} />
                            </Field>
                            <Field
                                label="Kewarganegaraan Ibu"
                                htmlFor="kewarganegaraanIbu"
                                error={errors.kewarganegaraanIbu?.message}
                            >
                                <Controller
                                    name="kewarganegaraanIbu"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="kewarganegaraanIbu"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan Ibu"
                                htmlFor="pekerjaanIbu"
                                error={errors.pekerjaanIbu?.message}
                            >
                                <Input id="pekerjaanIbu" {...register("pekerjaanIbu")} />
                            </Field>
                            <div />
                            <Field
                                label="Padukuhan Ibu"
                                htmlFor="alamatIbu.padukuhan"
                                error={errors.alamatIbu?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatIbu.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatIbu.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="RT" htmlFor="alamatIbu.rt" error={errors.alamatIbu?.rt?.message}>
                                    <Input
                                        id="alamatIbu.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatIbu.rt")}
                                    />
                                </Field>
                                <Field label="RW" htmlFor="alamatIbu.rw" error={errors.alamatIbu?.rw?.message}>
                                    <Input
                                        id="alamatIbu.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatIbu.rw")}
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection title="Saksi I">
                            <Field label="Nama" htmlFor="saksi1.nama" error={errors.saksi1?.nama?.message}>
                                <Input id="saksi1.nama" {...register("saksi1.nama")} />
                            </Field>
                            <Field label="NIK" htmlFor="saksi1.nik" error={errors.saksi1?.nik?.message}>
                                <Input
                                    id="saksi1.nik"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("saksi1.nik")}
                                />
                            </Field>
                            <Field
                                label="Nomor KK"
                                htmlFor="saksi1.noKK"
                                hint="Opsional"
                                error={errors.saksi1?.noKK?.message}
                            >
                                <Input
                                    id="saksi1.noKK"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("saksi1.noKK")}
                                />
                            </Field>
                            <Field
                                label="Kewarganegaraan"
                                htmlFor="saksi1.kewarganegaraan"
                                error={errors.saksi1?.kewarganegaraan?.message}
                            >
                                <Controller
                                    name="saksi1.kewarganegaraan"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="saksi1.kewarganegaraan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field label="Umur" htmlFor="saksi1.umur" error={errors.saksi1?.umur?.message}>
                                <Input id="saksi1.umur" type="number" {...register("saksi1.umur")} />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="saksi1.pekerjaan"
                                error={errors.saksi1?.pekerjaan?.message}
                            >
                                <Input id="saksi1.pekerjaan" {...register("saksi1.pekerjaan")} />
                            </Field>
                            <Field label="Alamat" htmlFor="saksi1.alamat" error={errors.saksi1?.alamat?.message}>
                                <Input id="saksi1.alamat" {...register("saksi1.alamat")} />
                            </Field>
                        </FormSection>

                        <FormSection title="Saksi II">
                            <Field label="Nama" htmlFor="saksi2.nama" error={errors.saksi2?.nama?.message}>
                                <Input id="saksi2.nama" {...register("saksi2.nama")} />
                            </Field>
                            <Field label="NIK" htmlFor="saksi2.nik" error={errors.saksi2?.nik?.message}>
                                <Input
                                    id="saksi2.nik"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("saksi2.nik")}
                                />
                            </Field>
                            <Field
                                label="Nomor KK"
                                htmlFor="saksi2.noKK"
                                hint="Opsional"
                                error={errors.saksi2?.noKK?.message}
                            >
                                <Input
                                    id="saksi2.noKK"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("saksi2.noKK")}
                                />
                            </Field>
                            <Field
                                label="Kewarganegaraan"
                                htmlFor="saksi2.kewarganegaraan"
                                error={errors.saksi2?.kewarganegaraan?.message}
                            >
                                <Controller
                                    name="saksi2.kewarganegaraan"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="saksi2.kewarganegaraan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field label="Umur" htmlFor="saksi2.umur" error={errors.saksi2?.umur?.message}>
                                <Input id="saksi2.umur" type="number" {...register("saksi2.umur")} />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="saksi2.pekerjaan"
                                error={errors.saksi2?.pekerjaan?.message}
                            >
                                <Input id="saksi2.pekerjaan" {...register("saksi2.pekerjaan")} />
                            </Field>
                            <Field label="Alamat" htmlFor="saksi2.alamat" error={errors.saksi2?.alamat?.message}>
                                <Input id="saksi2.alamat" {...register("saksi2.alamat")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Pelapor"
                            description="Warga yang melaporkan kematian ini ke Kelurahan."
                        >
                            <Field
                                label="Nama Pelapor"
                                htmlFor="namaPelapor"
                                error={errors.namaPelapor?.message}
                            >
                                <Input id="namaPelapor" {...register("namaPelapor")} />
                            </Field>
                            <Field
                                label="NIK Pelapor"
                                htmlFor="nikPelapor"
                                error={errors.nikPelapor?.message}
                            >
                                <Input
                                    id="nikPelapor"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikPelapor")}
                                />
                            </Field>
                            <Field
                                label="Nomor KK Pelapor"
                                htmlFor="noKKPelapor"
                                error={errors.noKKPelapor?.message}
                            >
                                <Input
                                    id="noKKPelapor"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("noKKPelapor")}
                                />
                            </Field>
                            <Field label="Umur Pelapor" htmlFor="umurPelapor" error={errors.umurPelapor?.message}>
                                <Input id="umurPelapor" type="number" {...register("umurPelapor")} />
                            </Field>
                            <Field
                                label="Kewarganegaraan Pelapor"
                                htmlFor="kewarganegaraanPelapor"
                                error={errors.kewarganegaraanPelapor?.message}
                            >
                                <Controller
                                    name="kewarganegaraanPelapor"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="kewarganegaraanPelapor"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan Pelapor"
                                htmlFor="pekerjaanPelapor"
                                error={errors.pekerjaanPelapor?.message}
                            >
                                <Input id="pekerjaanPelapor" {...register("pekerjaanPelapor")} />
                            </Field>
                            <Field
                                label="Nomor HP Pelapor"
                                htmlFor="noHPPelapor"
                                hint="Opsional"
                                error={errors.noHPPelapor?.message}
                            >
                                <Input id="noHPPelapor" inputMode="numeric" {...register("noHPPelapor")} />
                            </Field>
                            <Field
                                label="Padukuhan"
                                htmlFor="alamatPelapor.padukuhan"
                                error={errors.alamatPelapor?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatPelapor.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatPelapor.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatPelapor.rt"
                                    error={errors.alamatPelapor?.rt?.message}
                                >
                                    <Input
                                        id="alamatPelapor.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatPelapor.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatPelapor.rw"
                                    error={errors.alamatPelapor?.rw?.message}
                                >
                                    <Input
                                        id="alamatPelapor.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatPelapor.rw")}
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
