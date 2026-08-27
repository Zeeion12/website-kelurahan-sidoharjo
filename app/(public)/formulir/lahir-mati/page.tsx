"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
    lahirMatiSchema,
    type LahirMatiFormInput,
} from "@/lib/validations/lahir-mati.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("lahir-mati")!;

export default function LahirMatiFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LahirMatiFormInput>({
        resolver: zodResolver(lahirMatiSchema),
        defaultValues: {
            namaAyah: "",
            nikAyah: "",
            tempatLahirAyah: "",
            tanggalLahirAyah: "",
            umurAyah: 0,
            kewarganegaraanAyah: "wni",
            pekerjaanAyah: "",
            alamatAyah: {
                padukuhan: "" as LahirMatiFormInput["alamatAyah"]["padukuhan"],
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
                padukuhan: "" as LahirMatiFormInput["alamatIbu"]["padukuhan"],
                rt: "",
                rw: "",
            },
            tempatPerkawinan: "" as LahirMatiFormInput["tempatPerkawinan"],
            tanggalPerkawinan: "",
            jenisKelaminAnak: "" as LahirMatiFormInput["jenisKelaminAnak"],
            lamanyaDalamKandunganBulan: 0,
            tanggalLahirMati: "",
            jenisKelahiran: "" as LahirMatiFormInput["jenisKelahiran"],
            anakKe: 1,
            tempatDilahirkan: "" as LahirMatiFormInput["tempatDilahirkan"],
            tempatKelahiran: "",
            penolongKelahiran: "" as LahirMatiFormInput["penolongKelahiran"],
            sebabLahirMati: "",
            yangMenentukan: "" as LahirMatiFormInput["yangMenentukan"],
            namaPelapor: "",
            nikPelapor: "",
            noKKPelapor: "",
            umurPelapor: 0,
            kewarganegaraanPelapor: "wni",
            pekerjaanPelapor: "",
            alamatPelapor: {
                padukuhan: "" as LahirMatiFormInput["alamatPelapor"]["padukuhan"],
                rt: "",
                rw: "",
            },
            saksi1: { nama: "", nik: "", noKK: "", kewarganegaraan: "wni", umur: 0, pekerjaan: "", alamat: "" },
            saksi2: { nama: "", nik: "", noKK: "", kewarganegaraan: "wni", umur: 0, pekerjaan: "", alamat: "" },
        },
    });

    async function onSubmit(values: LahirMatiFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({ jenisSurat: "lahir-mati", data: values });
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
                        <FormSection title="Data Ayah">
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
                                label="Padukuhan"
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
                                <Field
                                    label="RT"
                                    htmlFor="alamatAyah.rt"
                                    error={errors.alamatAyah?.rt?.message}
                                >
                                    <Input
                                        id="alamatAyah.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatAyah.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatAyah.rw"
                                    error={errors.alamatAyah?.rw?.message}
                                >
                                    <Input
                                        id="alamatAyah.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatAyah.rw")}
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection title="Data Ibu">
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
                                label="Padukuhan"
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
                                <Field
                                    label="RT"
                                    htmlFor="alamatIbu.rt"
                                    error={errors.alamatIbu?.rt?.message}
                                >
                                    <Input
                                        id="alamatIbu.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatIbu.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatIbu.rw"
                                    error={errors.alamatIbu?.rw?.message}
                                >
                                    <Input
                                        id="alamatIbu.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatIbu.rw")}
                                    />
                                </Field>
                            </div>
                            <Field
                                label="Tempat Perkawinan"
                                htmlFor="tempatPerkawinan"
                                hint="Opsional"
                                error={errors.tempatPerkawinan?.message}
                            >
                                <Controller
                                    name="tempatPerkawinan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="tempatPerkawinan" className="w-full">
                                                <SelectValue placeholder="Pilih tempat perkawinan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kua">KUA</SelectItem>
                                                <SelectItem value="gereja">Gereja</SelectItem>
                                                <SelectItem value="pure">Pure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Tanggal Perkawinan"
                                htmlFor="tanggalPerkawinan"
                                hint="Opsional"
                                error={errors.tanggalPerkawinan?.message}
                            >
                                <Input
                                    id="tanggalPerkawinan"
                                    type="date"
                                    {...register("tanggalPerkawinan")}
                                />
                            </Field>
                        </FormSection>

                        <FormSection title="Data Anak">
                            <Field
                                label="Jenis Kelamin"
                                htmlFor="jenisKelaminAnak"
                                error={errors.jenisKelaminAnak?.message}
                            >
                                <Controller
                                    name="jenisKelaminAnak"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelaminAnak"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Tempat Kelahiran"
                                htmlFor="tempatKelahiran"
                                error={errors.tempatKelahiran?.message}
                            >
                                <Input id="tempatKelahiran" {...register("tempatKelahiran")} />
                            </Field>
                            <Field
                                label="Lamanya dalam Kandungan (bulan)"
                                htmlFor="lamanyaDalamKandunganBulan"
                                error={errors.lamanyaDalamKandunganBulan?.message}
                            >
                                <Input
                                    id="lamanyaDalamKandunganBulan"
                                    type="number"
                                    {...register("lamanyaDalamKandunganBulan")}
                                />
                            </Field>
                            <Field
                                label="Tanggal Lahir Mati"
                                htmlFor="tanggalLahirMati"
                                error={errors.tanggalLahirMati?.message}
                            >
                                <Input
                                    id="tanggalLahirMati"
                                    type="date"
                                    {...register("tanggalLahirMati")}
                                />
                            </Field>
                            <Field
                                label="Anak Ke"
                                htmlFor="anakKe"
                                error={errors.anakKe?.message}
                            >
                                <Input id="anakKe" type="number" min={1} {...register("anakKe")} />
                            </Field>
                            <Field
                                label="Jenis Kelahiran"
                                htmlFor="jenisKelahiran"
                                error={errors.jenisKelahiran?.message}
                            >
                                <Controller
                                    name="jenisKelahiran"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="jenisKelahiran" className="w-full">
                                                <SelectValue placeholder="Pilih jenis kelahiran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tunggal">Tunggal</SelectItem>
                                                <SelectItem value="kembar-2">Kembar 2</SelectItem>
                                                <SelectItem value="kembar-3">Kembar 3</SelectItem>
                                                <SelectItem value="kembar-4">Kembar 4</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Tempat Dilahirkan"
                                htmlFor="tempatDilahirkan"
                                error={errors.tempatDilahirkan?.message}
                            >
                                <Controller
                                    name="tempatDilahirkan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="tempatDilahirkan" className="w-full">
                                                <SelectValue placeholder="Pilih tempat" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rs-bidan">RS/Bidan</SelectItem>
                                                <SelectItem value="puskesmas">Puskesmas</SelectItem>
                                                <SelectItem value="polindes">Polindes</SelectItem>
                                                <SelectItem value="rumah">Rumah</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Penolong Kelahiran"
                                htmlFor="penolongKelahiran"
                                error={errors.penolongKelahiran?.message}
                            >
                                <Controller
                                    name="penolongKelahiran"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="penolongKelahiran" className="w-full">
                                                <SelectValue placeholder="Pilih penolong" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dokter">Dokter</SelectItem>
                                                <SelectItem value="bidan-perawat">
                                                    Bidan/Perawat
                                                </SelectItem>
                                                <SelectItem value="dukun">Dukun</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Yang Menentukan"
                                htmlFor="yangMenentukan"
                                error={errors.yangMenentukan?.message}
                            >
                                <Controller
                                    name="yangMenentukan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="yangMenentukan" className="w-full">
                                                <SelectValue placeholder="Pilih pihak" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dokter">Dokter</SelectItem>
                                                <SelectItem value="bidan-perawat">
                                                    Bidan/Perawat
                                                </SelectItem>
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
                            <Field
                                label="Sebab Lahir Mati"
                                htmlFor="sebabLahirMati"
                                error={errors.sebabLahirMati?.message}
                                className="sm:col-span-2"
                            >
                                <Textarea id="sebabLahirMati" rows={2} {...register("sebabLahirMati")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Pelapor"
                            description="Warga yang melaporkan kelahiran ini ke Kelurahan."
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

                        <FormSection title="Saksi I">
                            <Field
                                label="Nama"
                                htmlFor="saksi1.nama"
                                error={errors.saksi1?.nama?.message}
                            >
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
                            <Field
                                label="Umur"
                                htmlFor="saksi1.umur"
                                error={errors.saksi1?.umur?.message}
                            >
                                <Input id="saksi1.umur" type="number" {...register("saksi1.umur")} />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="saksi1.pekerjaan"
                                error={errors.saksi1?.pekerjaan?.message}
                            >
                                <Input id="saksi1.pekerjaan" {...register("saksi1.pekerjaan")} />
                            </Field>
                            <Field
                                label="Alamat"
                                htmlFor="saksi1.alamat"
                                error={errors.saksi1?.alamat?.message}
                            >
                                <Input id="saksi1.alamat" {...register("saksi1.alamat")} />
                            </Field>
                        </FormSection>

                        <FormSection title="Saksi II">
                            <Field
                                label="Nama"
                                htmlFor="saksi2.nama"
                                error={errors.saksi2?.nama?.message}
                            >
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
                            <Field
                                label="Umur"
                                htmlFor="saksi2.umur"
                                error={errors.saksi2?.umur?.message}
                            >
                                <Input id="saksi2.umur" type="number" {...register("saksi2.umur")} />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="saksi2.pekerjaan"
                                error={errors.saksi2?.pekerjaan?.message}
                            >
                                <Input id="saksi2.pekerjaan" {...register("saksi2.pekerjaan")} />
                            </Field>
                            <Field
                                label="Alamat"
                                htmlFor="saksi2.alamat"
                                error={errors.saksi2?.alamat?.message}
                            >
                                <Input id="saksi2.alamat" {...register("saksi2.alamat")} />
                            </Field>
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
