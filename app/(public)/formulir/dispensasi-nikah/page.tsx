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
import { JenisKelaminRadio } from "@/components/forms/jenis-kelamin-radio";
import { KewarganegaraanRadio } from "@/components/forms/kewarganegaraan-radio";
import {
    dispensasiNikahSchema,
    type DispensasiNikahFormInput,
} from "@/lib/validations/dispensasi-nikah.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("dispensasi-nikah")!;

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

function StatusPerkawinanSelect({
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

export default function DispensasiNikahFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DispensasiNikahFormInput>({
        resolver: zodResolver(dispensasiNikahSchema),
        defaultValues: {
            namaMempelai: "",
            jenisKelaminMempelai: "" as DispensasiNikahFormInput["jenisKelaminMempelai"],
            tempatLahirMempelai: "",
            tanggalLahirMempelai: "",
            kewarganegaraanMempelai: "wni",
            agamaMempelai: "" as DispensasiNikahFormInput["agamaMempelai"],
            pekerjaanMempelai: "",
            statusPerkawinanMempelai:
                "" as DispensasiNikahFormInput["statusPerkawinanMempelai"],
            alamatMempelai: {
                padukuhan: "" as DispensasiNikahFormInput["alamatMempelai"]["padukuhan"],
                rt: "",
                rw: "",
            },
            namaCalonPasangan: "",
            jenisKelaminCalonPasangan:
                "" as DispensasiNikahFormInput["jenisKelaminCalonPasangan"],
            tempatLahirCalonPasangan: "",
            tanggalLahirCalonPasangan: "",
            kewarganegaraanCalonPasangan: "wni",
            agamaCalonPasangan: "" as DispensasiNikahFormInput["agamaCalonPasangan"],
            pekerjaanCalonPasangan: "",
            statusPerkawinanCalonPasangan:
                "" as DispensasiNikahFormInput["statusPerkawinanCalonPasangan"],
            alamatCalonPasangan: "",
            tanggalAkad: "",
            jamAkad: "",
            tempatAkad: "",
        },
    });

    async function onSubmit(values: DispensasiNikahFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({
                jenisSurat: "dispensasi-nikah",
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
                            title="Data Mempelai"
                            description="Warga Sidoharjo, sesuai KTP/KK."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaMempelai"
                                error={errors.namaMempelai?.message}
                            >
                                <Input id="namaMempelai" {...register("namaMempelai")} />
                            </Field>
                            <Field
                                label="Jenis Kelamin"
                                htmlFor="jenisKelaminMempelai"
                                error={errors.jenisKelaminMempelai?.message}
                            >
                                <Controller
                                    name="jenisKelaminMempelai"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelaminMempelai"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirMempelai"
                                error={errors.tempatLahirMempelai?.message}
                            >
                                <Input id="tempatLahirMempelai" {...register("tempatLahirMempelai")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirMempelai"
                                error={errors.tanggalLahirMempelai?.message}
                            >
                                <Input
                                    id="tanggalLahirMempelai"
                                    type="date"
                                    {...register("tanggalLahirMempelai")}
                                />
                            </Field>
                            <Field
                                label="Kewarganegaraan"
                                htmlFor="kewarganegaraanMempelai"
                                error={errors.kewarganegaraanMempelai?.message}
                            >
                                <Controller
                                    name="kewarganegaraanMempelai"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="kewarganegaraanMempelai"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Agama"
                                htmlFor="agamaMempelai"
                                error={errors.agamaMempelai?.message}
                            >
                                <Controller
                                    name="agamaMempelai"
                                    control={control}
                                    render={({ field }) => (
                                        <AgamaSelect
                                            id="agamaMempelai"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaanMempelai"
                                error={errors.pekerjaanMempelai?.message}
                            >
                                <Input id="pekerjaanMempelai" {...register("pekerjaanMempelai")} />
                            </Field>
                            <Field
                                label="Status Perkawinan"
                                htmlFor="statusPerkawinanMempelai"
                                error={errors.statusPerkawinanMempelai?.message}
                            >
                                <Controller
                                    name="statusPerkawinanMempelai"
                                    control={control}
                                    render={({ field }) => (
                                        <StatusPerkawinanSelect
                                            id="statusPerkawinanMempelai"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection title="Alamat Mempelai">
                            <Field
                                label="Padukuhan"
                                htmlFor="alamatMempelai.padukuhan"
                                error={errors.alamatMempelai?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatMempelai.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatMempelai.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatMempelai.rt"
                                    error={errors.alamatMempelai?.rt?.message}
                                >
                                    <Input
                                        id="alamatMempelai.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatMempelai.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatMempelai.rw"
                                    error={errors.alamatMempelai?.rw?.message}
                                >
                                    <Input
                                        id="alamatMempelai.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatMempelai.rw")}
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Data Calon Pasangan"
                            description="Boleh berdomisili di luar Sidoharjo."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaCalonPasangan"
                                error={errors.namaCalonPasangan?.message}
                            >
                                <Input id="namaCalonPasangan" {...register("namaCalonPasangan")} />
                            </Field>
                            <Field
                                label="Jenis Kelamin"
                                htmlFor="jenisKelaminCalonPasangan"
                                error={errors.jenisKelaminCalonPasangan?.message}
                            >
                                <Controller
                                    name="jenisKelaminCalonPasangan"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelaminCalonPasangan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirCalonPasangan"
                                error={errors.tempatLahirCalonPasangan?.message}
                            >
                                <Input
                                    id="tempatLahirCalonPasangan"
                                    {...register("tempatLahirCalonPasangan")}
                                />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirCalonPasangan"
                                error={errors.tanggalLahirCalonPasangan?.message}
                            >
                                <Input
                                    id="tanggalLahirCalonPasangan"
                                    type="date"
                                    {...register("tanggalLahirCalonPasangan")}
                                />
                            </Field>
                            <Field
                                label="Kewarganegaraan"
                                htmlFor="kewarganegaraanCalonPasangan"
                                error={errors.kewarganegaraanCalonPasangan?.message}
                            >
                                <Controller
                                    name="kewarganegaraanCalonPasangan"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="kewarganegaraanCalonPasangan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Agama"
                                htmlFor="agamaCalonPasangan"
                                error={errors.agamaCalonPasangan?.message}
                            >
                                <Controller
                                    name="agamaCalonPasangan"
                                    control={control}
                                    render={({ field }) => (
                                        <AgamaSelect
                                            id="agamaCalonPasangan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaanCalonPasangan"
                                error={errors.pekerjaanCalonPasangan?.message}
                            >
                                <Input
                                    id="pekerjaanCalonPasangan"
                                    {...register("pekerjaanCalonPasangan")}
                                />
                            </Field>
                            <Field
                                label="Status Perkawinan"
                                htmlFor="statusPerkawinanCalonPasangan"
                                error={errors.statusPerkawinanCalonPasangan?.message}
                            >
                                <Controller
                                    name="statusPerkawinanCalonPasangan"
                                    control={control}
                                    render={({ field }) => (
                                        <StatusPerkawinanSelect
                                            id="statusPerkawinanCalonPasangan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Alamat Lengkap"
                                htmlFor="alamatCalonPasangan"
                                error={errors.alamatCalonPasangan?.message}
                                hint="Boleh di luar Sidoharjo, tulis lengkap."
                                className="sm:col-span-2"
                            >
                                <Input id="alamatCalonPasangan" {...register("alamatCalonPasangan")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Rencana Pelaksanaan Akad"
                        >
                            <Field
                                label="Tanggal Akad"
                                htmlFor="tanggalAkad"
                                error={errors.tanggalAkad?.message}
                            >
                                <Input id="tanggalAkad" type="date" {...register("tanggalAkad")} />
                            </Field>
                            <Field
                                label="Jam Akad"
                                htmlFor="jamAkad"
                                error={errors.jamAkad?.message}
                                hint="Format 24 jam, contoh 09:00"
                            >
                                <Input id="jamAkad" type="time" {...register("jamAkad")} />
                            </Field>
                            <Field
                                label="Tempat Akad"
                                htmlFor="tempatAkad"
                                error={errors.tempatAkad?.message}
                                className="sm:col-span-2"
                            >
                                <Input id="tempatAkad" {...register("tempatAkad")} />
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
