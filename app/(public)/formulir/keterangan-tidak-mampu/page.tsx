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
import {
    keteranganTidakMampuSchema,
    type KeteranganTidakMampuFormValues,
} from "@/lib/validations/keterangan-tidak-mampu.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { generateNomorTiket } from "@/lib/generate-tiket";
import { savePengajuan } from "@/lib/pengajuan-store";

const jenisSurat = getJenisSuratById("keterangan-tidak-mampu")!;

export default function KeteranganTidakMampuFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<KeteranganTidakMampuFormValues>({
        resolver: zodResolver(keteranganTidakMampuSchema),
        defaultValues: {
            namaPemohon: "",
            ktpPemohon: "",
            kkPemohon: "",
            tempatLahirPemohon: "",
            tanggalLahirPemohon: "",
            jenisKelaminPemohon: "" as KeteranganTidakMampuFormValues["jenisKelaminPemohon"],
            statusPerkawinanPemohon: "" as KeteranganTidakMampuFormValues["statusPerkawinanPemohon"],
            pekerjaanPemohon: "",
            pendidikanTerakhirPemohon: "" as KeteranganTidakMampuFormValues["pendidikanTerakhirPemohon"],
            agamaPemohon: "" as KeteranganTidakMampuFormValues["agamaPemohon"],
            alamatPemohon: "",
            namaAnak: "",
            nikAnak: "",
            tempatLahirAnak: "",
            tanggalLahirAnak: "",
            jenisKelaminAnak: "" as KeteranganTidakMampuFormValues["jenisKelaminAnak"],
            namaSekolah: "",
            fakultasProdi: "",
            kelasSemester: "",
        },
    });

    async function onSubmit(values: KeteranganTidakMampuFormValues) {
        // TODO: ganti simulasi ini dengan insert ke tabel `pengajuan` di Supabase
        // setelah tabelnya dibuat, lalu pakai nomor tiket dari database. Untuk
        // sementara data disimpan di localStorage lewat lib/pengajuan-store.ts.
        await new Promise((resolve) => setTimeout(resolve, 400));
        const tiket = generateNomorTiket("keterangan-tidak-mampu");
        savePengajuan({
            jenis_surat: "keterangan-tidak-mampu",
            nomor_tiket: tiket,
            data: values,
        });
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
                            title="Data Pemohon (Orang Tua/Wali)"
                            description="Isi sesuai KTP yang berlaku."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaPemohon"
                                error={errors.namaPemohon?.message}
                            >
                                <Input id="namaPemohon" {...register("namaPemohon")} />
                            </Field>
                            <Field
                                label="Nomor KTP"
                                htmlFor="ktpPemohon"
                                error={errors.ktpPemohon?.message}
                            >
                                <Input
                                    id="ktpPemohon"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("ktpPemohon")}
                                />
                            </Field>
                            <Field
                                label="Nomor Kartu Keluarga"
                                htmlFor="kkPemohon"
                                error={errors.kkPemohon?.message}
                            >
                                <Input
                                    id="kkPemohon"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("kkPemohon")}
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
                                label="Jenis Kelamin"
                                htmlFor="jenisKelaminPemohon"
                                error={errors.jenisKelaminPemohon?.message}
                            >
                                <Controller
                                    name="jenisKelaminPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelaminPemohon"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Status Perkawinan"
                                htmlFor="statusPerkawinanPemohon"
                                error={errors.statusPerkawinanPemohon?.message}
                            >
                                <Controller
                                    name="statusPerkawinanPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="statusPerkawinanPemohon" className="w-full">
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
                                htmlFor="pekerjaanPemohon"
                                error={errors.pekerjaanPemohon?.message}
                            >
                                <Input id="pekerjaanPemohon" {...register("pekerjaanPemohon")} />
                            </Field>
                            <Field
                                label="Pendidikan Terakhir"
                                htmlFor="pendidikanTerakhirPemohon"
                                error={errors.pendidikanTerakhirPemohon?.message}
                            >
                                <Controller
                                    name="pendidikanTerakhirPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="pendidikanTerakhirPemohon" className="w-full">
                                                <SelectValue placeholder="Pilih pendidikan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tidak-sekolah">
                                                    Tidak Sekolah
                                                </SelectItem>
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
                            <Field label="Agama" htmlFor="agamaPemohon" error={errors.agamaPemohon?.message}>
                                <Controller
                                    name="agamaPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="agamaPemohon" className="w-full">
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
                                label="Alamat"
                                htmlFor="alamatPemohon"
                                error={errors.alamatPemohon?.message}
                                className="sm:col-span-2"
                            >
                                <Textarea id="alamatPemohon" rows={2} {...register("alamatPemohon")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Anak"
                            description="Anak/tanggungan yang diajukan untuk keperluan surat ini."
                        >
                            <Field label="Nama Anak" htmlFor="namaAnak" error={errors.namaAnak?.message}>
                                <Input id="namaAnak" {...register("namaAnak")} />
                            </Field>
                            <Field label="NIK Anak" htmlFor="nikAnak" error={errors.nikAnak?.message}>
                                <Input
                                    id="nikAnak"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikAnak")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir Anak"
                                htmlFor="tempatLahirAnak"
                                error={errors.tempatLahirAnak?.message}
                            >
                                <Input id="tempatLahirAnak" {...register("tempatLahirAnak")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir Anak"
                                htmlFor="tanggalLahirAnak"
                                error={errors.tanggalLahirAnak?.message}
                            >
                                <Input
                                    id="tanggalLahirAnak"
                                    type="date"
                                    {...register("tanggalLahirAnak")}
                                />
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
                                label="Nama Sekolah/Universitas"
                                htmlFor="namaSekolah"
                                hint="Opsional, isi jika untuk keperluan sekolah/kuliah"
                                error={errors.namaSekolah?.message}
                            >
                                <Input id="namaSekolah" {...register("namaSekolah")} />
                            </Field>
                            <Field
                                label="Fakultas/Program Studi"
                                htmlFor="fakultasProdi"
                                hint="Opsional"
                                error={errors.fakultasProdi?.message}
                            >
                                <Input id="fakultasProdi" {...register("fakultasProdi")} />
                            </Field>
                            <Field
                                label="Kelas/Semester"
                                htmlFor="kelasSemester"
                                hint="Opsional"
                                error={errors.kelasSemester?.message}
                            >
                                <Input id="kelasSemester" {...register("kelasSemester")} />
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
