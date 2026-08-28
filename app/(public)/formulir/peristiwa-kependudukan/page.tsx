"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    peristiwaKependudukanSchema,
    PERSYARATAN_DILAMPIRKAN_LABEL,
    type PeristiwaKependudukanFormInput,
} from "@/lib/validations/peristiwa-kependudukan.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("peristiwa-kependudukan")!;

const KATEGORI_LABEL: Record<string, string> = {
    "kartu-keluarga": "Kartu Keluarga",
    "ktp-el": "KTP-el",
    "kartu-identitas-anak": "Kartu Identitas Anak",
    "perubahan-data": "Perubahan Data",
};

const JENIS_PERMOHONAN_LABEL: Record<string, string> = {
    "baru-membentuk-keluarga-baru": "Baru - Membentuk Keluarga Baru",
    "baru-penggantian-kepala-keluarga": "Baru - Penggantian Kepala Keluarga",
    "baru-pisah-kk": "Baru - Pisah KK",
    "baru-pindah-datang": "Baru - Pindah Datang",
    "baru-wni-dari-luar-negeri-karena-pindah": "Baru - WNI dari Luar Negeri karena Pindah",
    "baru-rentan-adminduk": "Baru - Penduduk Rentan Adminduk",
    "perubahan-menumpang-dalam-kk": "Perubahan - Menumpang dalam KK",
    "perubahan-peristiwa-penting": "Perubahan - Peristiwa Penting",
    "perubahan-elemen-data-dalam-kk": "Perubahan - Elemen Data dalam KK",
    hilang: "Hilang",
    rusak: "Rusak",
    baru: "Baru",
    "pindah-datang": "Pindah Datang",
    "perpanjangan-itap": "Perpanjangan ITAP",
    "perubahan-status-kewarganegaraan": "Perubahan Status Kewarganegaraan",
    "luar-domisili": "Luar Domisili",
    transmigrasi: "Transmigrasi",
    lainnya: "Lainnya",
    kk: "Kartu Keluarga",
    "ktp-el": "KTP-el",
    kia: "Kartu Identitas Anak",
};

const JENIS_PERMOHONAN_PER_KATEGORI: Record<string, string[]> = {
    "kartu-keluarga": [
        "baru-membentuk-keluarga-baru",
        "baru-penggantian-kepala-keluarga",
        "baru-pisah-kk",
        "baru-pindah-datang",
        "baru-wni-dari-luar-negeri-karena-pindah",
        "baru-rentan-adminduk",
        "perubahan-menumpang-dalam-kk",
        "perubahan-peristiwa-penting",
        "perubahan-elemen-data-dalam-kk",
        "hilang",
        "rusak",
    ],
    "ktp-el": [
        "baru",
        "pindah-datang",
        "hilang",
        "rusak",
        "perpanjangan-itap",
        "perubahan-status-kewarganegaraan",
        "luar-domisili",
        "transmigrasi",
    ],
    "kartu-identitas-anak": ["baru", "hilang", "rusak", "perpanjangan-itap", "lainnya"],
    "perubahan-data": ["kk", "ktp-el", "kia"],
};

const PERSYARATAN_URUT = Object.keys(PERSYARATAN_DILAMPIRKAN_LABEL) as Array<
    keyof typeof PERSYARATAN_DILAMPIRKAN_LABEL
>;

export default function PeristiwaKependudukanFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PeristiwaKependudukanFormInput>({
        resolver: zodResolver(peristiwaKependudukanSchema),
        defaultValues: {
            namaPengaju: "",
            namaLengkap: "",
            nik: "",
            nomorKK: "",
            kategoriPermohonan: "" as PeristiwaKependudukanFormInput["kategoriPermohonan"],
            jenisPermohonan: "" as PeristiwaKependudukanFormInput["jenisPermohonan"],
            persyaratanDilampirkan: [],
        },
    });

    const kategoriPermohonan = watch("kategoriPermohonan");
    const persyaratanDilampirkan = watch("persyaratanDilampirkan") ?? [];
    const opsiJenisPermohonan = kategoriPermohonan
        ? (JENIS_PERMOHONAN_PER_KATEGORI[kategoriPermohonan] ?? [])
        : [];

    useEffect(() => {
        setValue("jenisPermohonan", "" as PeristiwaKependudukanFormInput["jenisPermohonan"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kategoriPermohonan]);

    async function onSubmit(values: PeristiwaKependudukanFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({
                jenisSurat: "peristiwa-kependudukan",
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
                            title="Data Pengaju"
                            description="Warga yang mengisi formulir ini secara online, boleh sama dengan pemohon di bawah."
                        >
                            <Field
                                label="Nama Pengaju"
                                htmlFor="namaPengaju"
                                error={errors.namaPengaju?.message}
                                className="sm:col-span-2"
                            >
                                <Input id="namaPengaju" {...register("namaPengaju")} />
                            </Field>
                        </FormSection>

                        <FormSection title="Data Pemohon">
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaLengkap"
                                error={errors.namaLengkap?.message}
                            >
                                <Input id="namaLengkap" {...register("namaLengkap")} />
                            </Field>
                            <Field label="NIK" htmlFor="nik" error={errors.nik?.message}>
                                <Input id="nik" inputMode="numeric" maxLength={16} {...register("nik")} />
                            </Field>
                            <Field label="Nomor KK" htmlFor="nomorKK" error={errors.nomorKK?.message}>
                                <Input
                                    id="nomorKK"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nomorKK")}
                                />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Jenis Permohonan"
                            description="Pilih kategori dulu, lalu jenis permohonan yang sesuai."
                        >
                            <Field
                                label="Kategori Permohonan"
                                htmlFor="kategoriPermohonan"
                                error={errors.kategoriPermohonan?.message}
                            >
                                <Controller
                                    name="kategoriPermohonan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={(next) => field.onChange(next ?? "")}
                                        >
                                            <SelectTrigger id="kategoriPermohonan" className="w-full">
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(KATEGORI_LABEL).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Jenis Permohonan"
                                htmlFor="jenisPermohonan"
                                error={errors.jenisPermohonan?.message}
                                hint={!kategoriPermohonan ? "Pilih kategori dahulu" : undefined}
                            >
                                <Controller
                                    name="jenisPermohonan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={(next) => field.onChange(next ?? "")}
                                            disabled={!kategoriPermohonan}
                                        >
                                            <SelectTrigger id="jenisPermohonan" className="w-full">
                                                <SelectValue placeholder="Pilih jenis permohonan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opsiJenisPermohonan.map((value) => (
                                                    <SelectItem key={value} value={value}>
                                                        {JENIS_PERMOHONAN_LABEL[value] ?? value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            {kategoriPermohonan === "perubahan-data" && (
                                <p className="text-xs text-muted-foreground sm:col-span-2">
                                    Untuk permohonan perubahan data, lampirkan juga Formulir Perubahan
                                    Data dan Bukti Perubahan Data saat menyerahkan berkas ke Dukcapil.
                                </p>
                            )}
                        </FormSection>

                        <FormSection
                            title="Persyaratan yang Dilampirkan"
                            description="Centang berkas yang Anda lampirkan/bawa saat menyerahkan formulir ini."
                        >
                            <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
                                {PERSYARATAN_URUT.map((value) => (
                                    <Label
                                        key={value}
                                        className="flex items-start gap-2 font-normal"
                                    >
                                        <Checkbox
                                            checked={persyaratanDilampirkan.includes(value)}
                                            onCheckedChange={(checked) => {
                                                const next = checked
                                                    ? [...persyaratanDilampirkan, value]
                                                    : persyaratanDilampirkan.filter((v) => v !== value);
                                                setValue("persyaratanDilampirkan", next, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                        />
                                        <span>{PERSYARATAN_DILAMPIRKAN_LABEL[value]}</span>
                                    </Label>
                                ))}
                            </div>
                            {errors.persyaratanDilampirkan?.message && (
                                <p className="text-xs text-destructive sm:col-span-2">
                                    {errors.persyaratanDilampirkan.message}
                                </p>
                            )}
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
