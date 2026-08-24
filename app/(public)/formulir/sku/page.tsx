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
import { skuSchema, type SkuFormValues } from "@/lib/validations/sku.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { generateNomorTiket } from "@/lib/generate-tiket";
import { savePengajuan } from "@/lib/pengajuan-store";

const jenisSurat = getJenisSuratById("sku")!;

export default function SkuFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
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
            jenisKelamin: "" as SkuFormValues["jenisKelamin"],
            tempatLahir: "",
            tanggalLahir: "",
            agama: "" as SkuFormValues["agama"],
            statusPerkawinan: "" as SkuFormValues["statusPerkawinan"],
            pekerjaan: "",
            alamat: { padukuhan: "", rt: "", rw: "" },
            bidangUsaha: "",
            lokasiUsaha: "",
        },
    });

    async function onSubmit(values: SkuFormValues) {
        // TODO: ganti simulasi ini dengan insert ke tabel `pengajuan` di Supabase
        // setelah tabelnya dibuat, lalu pakai nomor tiket dari database. Untuk
        // sementara data disimpan di localStorage lewat lib/pengajuan-store.ts.
        await new Promise((resolve) => setTimeout(resolve, 400));
        const tiket = generateNomorTiket("sku");
        savePengajuan({ jenis_surat: "sku", nomor_tiket: tiket, data: values });
        setNomorTiket(tiket);
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
                        </FormSection>

                        <FormSection title="Alamat Tempat Tinggal">
                            <Field
                                label="Padukuhan"
                                htmlFor="alamat.padukuhan"
                                error={errors.alamat?.padukuhan?.message}
                            >
                                <Input id="alamat.padukuhan" {...register("alamat.padukuhan")} />
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
                                label="Lokasi Usaha"
                                htmlFor="lokasiUsaha"
                                error={errors.lokasiUsaha?.message}
                            >
                                <Input id="lokasiUsaha" {...register("lokasiUsaha")} />
                            </Field>
                        </FormSection>

                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
