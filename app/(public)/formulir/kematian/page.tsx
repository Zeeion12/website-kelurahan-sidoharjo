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
import { PadukuhanSelect } from "@/components/forms/padukuhan-select";
import { kematianSchema, type KematianFormValues } from "@/lib/validations/kematian.schema";
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
    } = useForm<KematianFormValues>({
        resolver: zodResolver(kematianSchema),
        defaultValues: {
            nikAlmarhum: "",
            namaAlmarhum: "",
            tanggalKematian: "",
            pukulKematian: "",
            sebabKematian: "" as KematianFormValues["sebabKematian"],
            tempatKematian: "",
            yangMenerangkan: "" as KematianFormValues["yangMenerangkan"],
            namaPelapor: "",
            nikPelapor: "",
            pekerjaanPelapor: "",
            alamatPelapor: {
                padukuhan: "" as KematianFormValues["alamatPelapor"]["padukuhan"],
                rt: "",
                rw: "",
            },
        },
    });

    async function onSubmit(values: KematianFormValues) {
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
