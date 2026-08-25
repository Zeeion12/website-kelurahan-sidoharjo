"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import {
    kelahiranSchema,
    type KelahiranFormInput,
} from "@/lib/validations/kelahiran.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("kelahiran")!;

export default function KelahiranFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<KelahiranFormInput>({
        resolver: zodResolver(kelahiranSchema),
        defaultValues: {
            laporanKelahiran: "" as KelahiranFormInput["laporanKelahiran"],
            namaAyah: "",
            nikAyah: "",
            pekerjaanAyah: "",
            alamatAyah: {
                padukuhan: "" as KelahiranFormInput["alamatAyah"]["padukuhan"],
                rt: "",
                rw: "",
            },
            namaIbu: "",
            nikIbu: "",
            pekerjaanIbu: "",
            alamatIbu: {
                padukuhan: "" as KelahiranFormInput["alamatIbu"]["padukuhan"],
                rt: "",
                rw: "",
            },
            tanggalPerkawinan: "",
            namaAnak: "",
            jenisKelaminAnak: "" as KelahiranFormInput["jenisKelaminAnak"],
            tempatLahir: "",
            tanggalLahir: "",
            jamLahir: "",
            jenisKelahiran: "" as KelahiranFormInput["jenisKelahiran"],
            anakKe: 1,
            penolongKelahiran: "" as KelahiranFormInput["penolongKelahiran"],
            beratBayiKg: 0,
            panjangBayiCm: 0,
            namaPelapor: "",
            nikPelapor: "",
            pekerjaanPelapor: "",
            alamatPelapor: {
                padukuhan: "" as KelahiranFormInput["alamatPelapor"]["padukuhan"],
                rt: "",
                rw: "",
            },
            saksi1: { nama: "", umur: 0, pekerjaan: "", alamat: "" },
            saksi2: { nama: "", umur: 0, pekerjaan: "", alamat: "" },
        },
    });

    async function onSubmit(values: KelahiranFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({ jenisSurat: "kelahiran", data: values });
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
                        <FormSection title="Jenis Laporan">
                            <Field
                                label="Laporan Kelahiran"
                                htmlFor="laporanKelahiran"
                                error={errors.laporanKelahiran?.message}
                                className="sm:col-span-2"
                            >
                                <Controller
                                    name="laporanKelahiran"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="flex flex-row gap-6"
                                        >
                                            <Label className="flex items-center gap-2 font-normal">
                                                <RadioGroupItem value="umum" />
                                                Umum
                                            </Label>
                                            <Label className="flex items-center gap-2 font-normal">
                                                <RadioGroupItem value="terlambat" />
                                                Terlambat
                                            </Label>
                                        </RadioGroup>
                                    )}
                                />
                            </Field>
                        </FormSection>

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
                            <div className="grid grid-cols-2 gap-4">
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
                                label="Pekerjaan Ibu"
                                htmlFor="pekerjaanIbu"
                                error={errors.pekerjaanIbu?.message}
                            >
                                <Input id="pekerjaanIbu" {...register("pekerjaanIbu")} />
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
                            <div className="grid grid-cols-2 gap-4">
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
                        </FormSection>

                        <FormSection title="Data Anak">
                            <Field label="Nama Anak" htmlFor="namaAnak" error={errors.namaAnak?.message}>
                                <Input id="namaAnak" {...register("namaAnak")} />
                            </Field>
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
                                label="Tempat Lahir"
                                htmlFor="tempatLahir"
                                error={errors.tempatLahir?.message}
                            >
                                <Input id="tempatLahir" {...register("tempatLahir")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahir"
                                error={errors.tanggalLahir?.message}
                            >
                                <Input id="tanggalLahir" type="date" {...register("tanggalLahir")} />
                            </Field>
                            <Field label="Jam Lahir" htmlFor="jamLahir" error={errors.jamLahir?.message}>
                                <Input id="jamLahir" type="time" {...register("jamLahir")} />
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
                                label="Berat Bayi (kg)"
                                htmlFor="beratBayiKg"
                                error={errors.beratBayiKg?.message}
                            >
                                <Input
                                    id="beratBayiKg"
                                    type="number"
                                    step="0.1"
                                    {...register("beratBayiKg")}
                                />
                            </Field>
                            <Field
                                label="Panjang Bayi (cm)"
                                htmlFor="panjangBayiCm"
                                error={errors.panjangBayiCm?.message}
                            >
                                <Input
                                    id="panjangBayiCm"
                                    type="number"
                                    step="0.1"
                                    {...register("panjangBayiCm")}
                                />
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
                                label="Pekerjaan Pelapor"
                                htmlFor="pekerjaanPelapor"
                                error={errors.pekerjaanPelapor?.message}
                            >
                                <Input id="pekerjaanPelapor" {...register("pekerjaanPelapor")} />
                            </Field>
                            <div />
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
                            <div className="grid grid-cols-2 gap-4">
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
