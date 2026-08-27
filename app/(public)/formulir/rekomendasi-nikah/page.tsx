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
import {
    rekomendasiNikahSchema,
    type RekomendasiNikahFormInput,
} from "@/lib/validations/rekomendasi-nikah.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("rekomendasi-nikah")!;

function AgamaSelect({
    id,
    value,
    onChange,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
}) {
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

export default function RekomendasiNikahFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RekomendasiNikahFormInput>({
        resolver: zodResolver(rekomendasiNikahSchema),
        defaultValues: {
            namaPemohon: "",
            nikPemohon: "",
            tempatLahirPemohon: "",
            tanggalLahirPemohon: "",
            agamaPemohon: "" as RekomendasiNikahFormInput["agamaPemohon"],
            pekerjaanPemohon: "",
            alamatPemohon: {
                padukuhan: "" as RekomendasiNikahFormInput["alamatPemohon"]["padukuhan"],
                rt: "",
                rw: "",
            },
            namaCalonIstri: "",
            tempatLahirCalonIstri: "",
            tanggalLahirCalonIstri: "",
            agamaCalonIstri: "" as RekomendasiNikahFormInput["agamaCalonIstri"],
            pekerjaanCalonIstri: "",
            alamatCalonIstri: "",
        },
    });

    async function onSubmit(values: RekomendasiNikahFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({
                jenisSurat: "rekomendasi-nikah",
                data: values,
            });
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
                            description="Calon suami, sesuai KTP yang berlaku."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaPemohon"
                                error={errors.namaPemohon?.message}
                            >
                                <Input id="namaPemohon" {...register("namaPemohon")} />
                            </Field>
                            <Field
                                label="NIK (opsional)"
                                htmlFor="nikPemohon"
                                error={errors.nikPemohon?.message}
                            >
                                <Input
                                    id="nikPemohon"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikPemohon")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirPemohon"
                                error={errors.tempatLahirPemohon?.message}
                            >
                                <Input id="tempatLahirPemohon" {...register("tempatLahirPemohon")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirPemohon"
                                error={errors.tanggalLahirPemohon?.message}
                            >
                                <Input
                                    id="tanggalLahirPemohon"
                                    type="date"
                                    {...register("tanggalLahirPemohon")}
                                />
                            </Field>
                            <Field
                                label="Agama"
                                htmlFor="agamaPemohon"
                                error={errors.agamaPemohon?.message}
                            >
                                <Controller
                                    name="agamaPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <AgamaSelect
                                            id="agamaPemohon"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaanPemohon"
                                error={errors.pekerjaanPemohon?.message}
                            >
                                <Input id="pekerjaanPemohon" {...register("pekerjaanPemohon")} />
                            </Field>
                        </FormSection>

                        <FormSection title="Alamat Pemohon">
                            <Field
                                label="Padukuhan"
                                htmlFor="alamatPemohon.padukuhan"
                                error={errors.alamatPemohon?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatPemohon.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatPemohon.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatPemohon.rt"
                                    error={errors.alamatPemohon?.rt?.message}
                                >
                                    <Input
                                        id="alamatPemohon.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatPemohon.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatPemohon.rw"
                                    error={errors.alamatPemohon?.rw?.message}
                                >
                                    <Input
                                        id="alamatPemohon.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatPemohon.rw")}
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Data Calon Istri"
                            description="Boleh berdomisili di luar Sidoharjo."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaCalonIstri"
                                error={errors.namaCalonIstri?.message}
                            >
                                <Input id="namaCalonIstri" {...register("namaCalonIstri")} />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirCalonIstri"
                                error={errors.tempatLahirCalonIstri?.message}
                            >
                                <Input
                                    id="tempatLahirCalonIstri"
                                    {...register("tempatLahirCalonIstri")}
                                />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirCalonIstri"
                                error={errors.tanggalLahirCalonIstri?.message}
                            >
                                <Input
                                    id="tanggalLahirCalonIstri"
                                    type="date"
                                    {...register("tanggalLahirCalonIstri")}
                                />
                            </Field>
                            <Field
                                label="Agama"
                                htmlFor="agamaCalonIstri"
                                error={errors.agamaCalonIstri?.message}
                            >
                                <Controller
                                    name="agamaCalonIstri"
                                    control={control}
                                    render={({ field }) => (
                                        <AgamaSelect
                                            id="agamaCalonIstri"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaanCalonIstri"
                                error={errors.pekerjaanCalonIstri?.message}
                            >
                                <Input id="pekerjaanCalonIstri" {...register("pekerjaanCalonIstri")} />
                            </Field>
                            <Field
                                label="Alamat Lengkap"
                                htmlFor="alamatCalonIstri"
                                error={errors.alamatCalonIstri?.message}
                                hint="Boleh di luar Sidoharjo, tulis lengkap."
                                className="sm:col-span-2"
                            >
                                <Input id="alamatCalonIstri" {...register("alamatCalonIstri")} />
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
