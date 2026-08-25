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
import { skuSchema, type SkuFormValues } from "@/lib/validations/sku.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("sku")!;

export default function SkuFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SkuFormValues>({
        resolver: zodResolver(skuSchema),
        // Nilai awal string kosong (bukan undefined) supaya Select/RadioGroup
        // dari Base UI tetap controlled sejak render pertama.
        defaultValues: {
            nama: "",
            nik: "",
            noKK: "",
            tempatLahir: "",
            tanggalLahir: "",
            jenisKelamin: "" as SkuFormValues["jenisKelamin"],
            statusPerkawinan: "" as SkuFormValues["statusPerkawinan"],
            pekerjaan: "",
            pendidikanTerakhir: "" as SkuFormValues["pendidikanTerakhir"],
            agama: "" as SkuFormValues["agama"],
            alamat: { padukuhan: "" as SkuFormValues["alamat"]["padukuhan"], rt: "", rw: "" },
            bidangUsaha: "",
            jenisUsaha: "",
            lokasiUsaha: "",
        },
    });

    async function onSubmit(values: SkuFormValues) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({ jenisSurat: "sku", data: values });
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
                            title="Data Pemohon"
                            description="Isi sesuai KTP yang berlaku."
                        >
                            <Field label="Nama Lengkap" htmlFor="nama" error={errors.nama?.message}>
                                <Input id="nama" {...register("nama")} />
                            </Field>
                            <Field label="NIK" htmlFor="nik" error={errors.nik?.message}>
                                <Input id="nik" inputMode="numeric" maxLength={16} {...register("nik")} />
                            </Field>
                            <Field label="Nomor KK" htmlFor="noKK" error={errors.noKK?.message}>
                                <Input id="noKK" inputMode="numeric" maxLength={16} {...register("noKK")} />
                            </Field>
                            <Field
                                label="Jenis Kelamin"
                                htmlFor="jenisKelamin"
                                error={errors.jenisKelamin?.message}
                            >
                                <Controller
                                    name="jenisKelamin"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelamin"
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
                            <Field label="Agama" htmlFor="agama" error={errors.agama?.message}>
                                <Controller
                                    name="agama"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="agama" className="w-full">
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
                                    )}
                                />
                            </Field>
                            <Field
                                label="Status Perkawinan"
                                htmlFor="statusPerkawinan"
                                error={errors.statusPerkawinan?.message}
                            >
                                <Controller
                                    name="statusPerkawinan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="statusPerkawinan" className="w-full">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="belum-kawin">Belum Kawin</SelectItem>
                                                <SelectItem value="kawin">Kawin</SelectItem>
                                                <SelectItem value="cerai-hidup">Cerai Hidup</SelectItem>
                                                <SelectItem value="cerai-mati">Cerai Mati</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaan"
                                error={errors.pekerjaan?.message}
                            >
                                <Input id="pekerjaan" {...register("pekerjaan")} />
                            </Field>
                            <Field
                                label="Pendidikan Terakhir"
                                htmlFor="pendidikanTerakhir"
                                error={errors.pendidikanTerakhir?.message}
                            >
                                <Controller
                                    name="pendidikanTerakhir"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="pendidikanTerakhir" className="w-full">
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
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection title="Alamat Tempat Tinggal">
                            <Field
                                label="Padukuhan"
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
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="RT" htmlFor="alamat.rt" error={errors.alamat?.rt?.message}>
                                    <Input id="alamat.rt" inputMode="numeric" maxLength={2} {...register("alamat.rt")} />
                                </Field>
                                <Field label="RW" htmlFor="alamat.rw" error={errors.alamat?.rw?.message}>
                                    <Input id="alamat.rw" inputMode="numeric" maxLength={2} {...register("alamat.rw")} />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Data Usaha"
                            description="Sesuai usaha yang benar-benar dijalankan saat ini."
                        >
                            <Field
                                label="Bidang Usaha"
                                htmlFor="bidangUsaha"
                                error={errors.bidangUsaha?.message}
                            >
                                <Input id="bidangUsaha" {...register("bidangUsaha")} />
                            </Field>
                            <Field
                                label="Jenis Usaha"
                                htmlFor="jenisUsaha"
                                error={errors.jenisUsaha?.message}
                            >
                                <Input id="jenisUsaha" {...register("jenisUsaha")} />
                            </Field>
                            <Field
                                label="Lokasi Usaha"
                                htmlFor="lokasiUsaha"
                                error={errors.lokasiUsaha?.message}
                            >
                                <Input id="lokasiUsaha" {...register("lokasiUsaha")} />
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
