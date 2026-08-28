"use client";

import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
import { ShdkSelect } from "@/components/forms/shdk-select";
import {
    perubahanElemenDataSchema,
    type PerubahanElemenDataFormInput,
} from "@/lib/validations/perubahan-elemen-data.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("perubahan-elemen-data")!;

function PendidikanSelect({
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
    );
}

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

export default function PerubahanElemenDataFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PerubahanElemenDataFormInput>({
        resolver: zodResolver(perubahanElemenDataSchema),
        defaultValues: {
            namaPengaju: "",
            namaLengkap: "",
            nik: "",
            nomorKK: "",
            alamatRumah: {
                padukuhan: "" as PerubahanElemenDataFormInput["alamatRumah"]["padukuhan"],
                rt: "",
                rw: "",
            },
            anggotaKeluarga: [{ nama: "", nik: "", shdk: "" as never, keterangan: "" }],
            perubahanPendidikanPekerjaan: [],
            perubahanAgamaLainnya: [],
        },
    });

    const anggota = useFieldArray({ control, name: "anggotaKeluarga" });
    const pendidikanPekerjaan = useFieldArray({
        control,
        name: "perubahanPendidikanPekerjaan",
    });
    const agamaLainnya = useFieldArray({ control, name: "perubahanAgamaLainnya" });

    async function onSubmit(values: PerubahanElemenDataFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({
                jenisSurat: "perubahan-elemen-data",
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
                            description="Warga yang mengisi formulir ini secara online, boleh sama dengan yang menyatakan di bawah."
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

                        <FormSection title="Data yang Menyatakan">
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

                        <FormSection title="Alamat Rumah">
                            <Field
                                label="Padukuhan"
                                htmlFor="alamatRumah.padukuhan"
                                error={errors.alamatRumah?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatRumah.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatRumah.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatRumah.rt"
                                    error={errors.alamatRumah?.rt?.message}
                                >
                                    <Input
                                        id="alamatRumah.rt"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatRumah.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatRumah.rw"
                                    error={errors.alamatRumah?.rw?.message}
                                >
                                    <Input
                                        id="alamatRumah.rw"
                                        inputMode="numeric"
                                        maxLength={2}
                                        {...register("alamatRumah.rw")}
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Anggota Keluarga dalam KK"
                            description="Nomor urut di daftar ini dipakai sebagai acuan 'Nomor Anggota' di bagian perubahan data."
                        >
                            <div className="flex flex-col gap-4 sm:col-span-2">
                                {anggota.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-4 rounded-md border border-border p-3 sm:grid-cols-2"
                                    >
                                        <p className="text-xs font-medium text-muted-foreground sm:col-span-2">
                                            Anggota Nomor {index + 1}
                                        </p>
                                        <Field
                                            label="Nama"
                                            htmlFor={`anggotaKeluarga.${index}.nama`}
                                            error={errors.anggotaKeluarga?.[index]?.nama?.message}
                                        >
                                            <Input
                                                id={`anggotaKeluarga.${index}.nama`}
                                                {...register(`anggotaKeluarga.${index}.nama`)}
                                            />
                                        </Field>
                                        <Field
                                            label="NIK"
                                            htmlFor={`anggotaKeluarga.${index}.nik`}
                                            error={errors.anggotaKeluarga?.[index]?.nik?.message}
                                        >
                                            <Input
                                                id={`anggotaKeluarga.${index}.nik`}
                                                inputMode="numeric"
                                                maxLength={16}
                                                {...register(`anggotaKeluarga.${index}.nik`)}
                                            />
                                        </Field>
                                        <Field
                                            label="Status Hubungan Keluarga"
                                            htmlFor={`anggotaKeluarga.${index}.shdk`}
                                            error={errors.anggotaKeluarga?.[index]?.shdk?.message}
                                        >
                                            <Controller
                                                name={`anggotaKeluarga.${index}.shdk`}
                                                control={control}
                                                render={({ field: shdkField }) => (
                                                    <ShdkSelect
                                                        id={`anggotaKeluarga.${index}.shdk`}
                                                        value={shdkField.value}
                                                        onChange={shdkField.onChange}
                                                    />
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Keterangan"
                                            htmlFor={`anggotaKeluarga.${index}.keterangan`}
                                            hint="Opsional"
                                            error={errors.anggotaKeluarga?.[index]?.keterangan?.message}
                                        >
                                            <Input
                                                id={`anggotaKeluarga.${index}.keterangan`}
                                                {...register(`anggotaKeluarga.${index}.keterangan`)}
                                            />
                                        </Field>
                                        {anggota.fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="sm:col-span-2 sm:w-fit"
                                                onClick={() => anggota.remove(index)}
                                            >
                                                <Trash2 />
                                                Hapus Anggota
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {anggota.fields.length < 10 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-fit"
                                        onClick={() =>
                                            anggota.append({ nama: "", nik: "", shdk: "" as never, keterangan: "" })
                                        }
                                    >
                                        <Plus />
                                        Tambah Anggota
                                    </Button>
                                )}
                            </div>
                        </FormSection>

                        <FormSection
                            title="Perubahan Pendidikan / Pekerjaan"
                            description="Isi kalau ada perubahan tingkat pendidikan atau jenis pekerjaan. Boleh dikosongkan kalau tidak ada perubahan di bagian ini."
                        >
                            <div className="flex flex-col gap-4 sm:col-span-2">
                                {typeof errors.perubahanPendidikanPekerjaan?.message === "string" && (
                                    <p className="text-xs text-destructive">
                                        {errors.perubahanPendidikanPekerjaan.message}
                                    </p>
                                )}
                                {pendidikanPekerjaan.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-4 rounded-md border border-border p-3 sm:grid-cols-2"
                                    >
                                        <Field
                                            label="Nomor Anggota"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.nomorAnggota`}
                                            hint="Sesuai nomor urut di daftar anggota keluarga di atas"
                                            error={
                                                errors.perubahanPendidikanPekerjaan?.[index]?.nomorAnggota
                                                    ?.message
                                            }
                                        >
                                            <Input
                                                id={`perubahanPendidikanPekerjaan.${index}.nomorAnggota`}
                                                type="number"
                                                min={1}
                                                {...register(
                                                    `perubahanPendidikanPekerjaan.${index}.nomorAnggota`
                                                )}
                                            />
                                        </Field>
                                        <div />
                                        <Field
                                            label="Pendidikan Semula"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.pendidikanSemula`}
                                            error={
                                                errors.perubahanPendidikanPekerjaan?.[index]
                                                    ?.pendidikanSemula?.message
                                            }
                                        >
                                            <Controller
                                                name={`perubahanPendidikanPekerjaan.${index}.pendidikanSemula`}
                                                control={control}
                                                render={({ field: pField }) => (
                                                    <PendidikanSelect
                                                        id={`perubahanPendidikanPekerjaan.${index}.pendidikanSemula`}
                                                        value={pField.value ?? ""}
                                                        onChange={pField.onChange}
                                                    />
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Pendidikan Menjadi"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.pendidikanMenjadi`}
                                            error={
                                                errors.perubahanPendidikanPekerjaan?.[index]
                                                    ?.pendidikanMenjadi?.message
                                            }
                                        >
                                            <Controller
                                                name={`perubahanPendidikanPekerjaan.${index}.pendidikanMenjadi`}
                                                control={control}
                                                render={({ field: pField }) => (
                                                    <PendidikanSelect
                                                        id={`perubahanPendidikanPekerjaan.${index}.pendidikanMenjadi`}
                                                        value={pField.value ?? ""}
                                                        onChange={pField.onChange}
                                                    />
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Dasar Perubahan Pendidikan"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.dasarPerubahanPendidikan`}
                                            className="sm:col-span-2"
                                        >
                                            <Input
                                                id={`perubahanPendidikanPekerjaan.${index}.dasarPerubahanPendidikan`}
                                                {...register(
                                                    `perubahanPendidikanPekerjaan.${index}.dasarPerubahanPendidikan`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Pekerjaan Semula"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.pekerjaanSemula`}
                                        >
                                            <Input
                                                id={`perubahanPendidikanPekerjaan.${index}.pekerjaanSemula`}
                                                {...register(
                                                    `perubahanPendidikanPekerjaan.${index}.pekerjaanSemula`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Pekerjaan Menjadi"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.pekerjaanMenjadi`}
                                            error={
                                                errors.perubahanPendidikanPekerjaan?.[index]
                                                    ?.pekerjaanMenjadi?.message
                                            }
                                        >
                                            <Input
                                                id={`perubahanPendidikanPekerjaan.${index}.pekerjaanMenjadi`}
                                                {...register(
                                                    `perubahanPendidikanPekerjaan.${index}.pekerjaanMenjadi`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Dasar Perubahan Pekerjaan"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.dasarPerubahanPekerjaan`}
                                        >
                                            <Input
                                                id={`perubahanPendidikanPekerjaan.${index}.dasarPerubahanPekerjaan`}
                                                {...register(
                                                    `perubahanPendidikanPekerjaan.${index}.dasarPerubahanPekerjaan`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Keterangan"
                                            htmlFor={`perubahanPendidikanPekerjaan.${index}.keterangan`}
                                            className="sm:col-span-2"
                                        >
                                            <Input
                                                id={`perubahanPendidikanPekerjaan.${index}.keterangan`}
                                                {...register(
                                                    `perubahanPendidikanPekerjaan.${index}.keterangan`
                                                )}
                                            />
                                        </Field>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="sm:col-span-2 sm:w-fit"
                                            onClick={() => pendidikanPekerjaan.remove(index)}
                                        >
                                            <Trash2 />
                                            Hapus Baris
                                        </Button>
                                    </div>
                                ))}
                                {pendidikanPekerjaan.fields.length < 7 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-fit"
                                        onClick={() =>
                                            pendidikanPekerjaan.append({
                                                nomorAnggota: 1,
                                                pendidikanSemula: "",
                                                pendidikanMenjadi: "",
                                                dasarPerubahanPendidikan: "",
                                                pekerjaanSemula: "",
                                                pekerjaanMenjadi: "",
                                                dasarPerubahanPekerjaan: "",
                                                keterangan: "",
                                            })
                                        }
                                    >
                                        <Plus />
                                        Tambah Baris Perubahan
                                    </Button>
                                )}
                            </div>
                        </FormSection>

                        <FormSection
                            title="Perubahan Agama / Data Lainnya"
                            description="Bagian 'Lainnya' juga dipakai untuk memperbaiki kesalahan pengisian atau kesalahan entri data oleh petugas sebelumnya. Boleh dikosongkan kalau tidak ada perubahan di bagian ini."
                        >
                            <div className="flex flex-col gap-4 sm:col-span-2">
                                {agamaLainnya.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-4 rounded-md border border-border p-3 sm:grid-cols-2"
                                    >
                                        <Field
                                            label="Nomor Anggota"
                                            htmlFor={`perubahanAgamaLainnya.${index}.nomorAnggota`}
                                            hint="Sesuai nomor urut di daftar anggota keluarga di atas"
                                            error={
                                                errors.perubahanAgamaLainnya?.[index]?.nomorAnggota?.message
                                            }
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.nomorAnggota`}
                                                type="number"
                                                min={1}
                                                {...register(`perubahanAgamaLainnya.${index}.nomorAnggota`)}
                                            />
                                        </Field>
                                        <div />
                                        <Field
                                            label="Agama Semula"
                                            htmlFor={`perubahanAgamaLainnya.${index}.agamaSemula`}
                                            error={errors.perubahanAgamaLainnya?.[index]?.agamaSemula?.message}
                                        >
                                            <Controller
                                                name={`perubahanAgamaLainnya.${index}.agamaSemula`}
                                                control={control}
                                                render={({ field: aField }) => (
                                                    <AgamaSelect
                                                        id={`perubahanAgamaLainnya.${index}.agamaSemula`}
                                                        value={aField.value ?? ""}
                                                        onChange={aField.onChange}
                                                    />
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Agama Menjadi"
                                            htmlFor={`perubahanAgamaLainnya.${index}.agamaMenjadi`}
                                            error={
                                                errors.perubahanAgamaLainnya?.[index]?.agamaMenjadi?.message
                                            }
                                        >
                                            <Controller
                                                name={`perubahanAgamaLainnya.${index}.agamaMenjadi`}
                                                control={control}
                                                render={({ field: aField }) => (
                                                    <AgamaSelect
                                                        id={`perubahanAgamaLainnya.${index}.agamaMenjadi`}
                                                        value={aField.value ?? ""}
                                                        onChange={aField.onChange}
                                                    />
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Dasar Perubahan Agama"
                                            htmlFor={`perubahanAgamaLainnya.${index}.dasarPerubahanAgama`}
                                            className="sm:col-span-2"
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.dasarPerubahanAgama`}
                                                {...register(
                                                    `perubahanAgamaLainnya.${index}.dasarPerubahanAgama`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Nama Elemen Lainnya"
                                            htmlFor={`perubahanAgamaLainnya.${index}.namaElemenLainnya`}
                                            hint="Contoh: 'Pendidikan', kalau bukan agama/pendidikan/pekerjaan"
                                            className="sm:col-span-2"
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.namaElemenLainnya`}
                                                {...register(
                                                    `perubahanAgamaLainnya.${index}.namaElemenLainnya`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Semula"
                                            htmlFor={`perubahanAgamaLainnya.${index}.lainnyaSemula`}
                                            error={
                                                errors.perubahanAgamaLainnya?.[index]?.lainnyaSemula?.message
                                            }
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.lainnyaSemula`}
                                                {...register(`perubahanAgamaLainnya.${index}.lainnyaSemula`)}
                                            />
                                        </Field>
                                        <Field
                                            label="Menjadi"
                                            htmlFor={`perubahanAgamaLainnya.${index}.lainnyaMenjadi`}
                                            error={
                                                errors.perubahanAgamaLainnya?.[index]?.lainnyaMenjadi?.message
                                            }
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.lainnyaMenjadi`}
                                                {...register(`perubahanAgamaLainnya.${index}.lainnyaMenjadi`)}
                                            />
                                        </Field>
                                        <Field
                                            label="Dasar Perubahan Lainnya"
                                            htmlFor={`perubahanAgamaLainnya.${index}.dasarPerubahanLainnya`}
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.dasarPerubahanLainnya`}
                                                {...register(
                                                    `perubahanAgamaLainnya.${index}.dasarPerubahanLainnya`
                                                )}
                                            />
                                        </Field>
                                        <Field
                                            label="Keterangan"
                                            htmlFor={`perubahanAgamaLainnya.${index}.keterangan`}
                                            className="sm:col-span-2"
                                        >
                                            <Input
                                                id={`perubahanAgamaLainnya.${index}.keterangan`}
                                                {...register(`perubahanAgamaLainnya.${index}.keterangan`)}
                                            />
                                        </Field>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="sm:col-span-2 sm:w-fit"
                                            onClick={() => agamaLainnya.remove(index)}
                                        >
                                            <Trash2 />
                                            Hapus Baris
                                        </Button>
                                    </div>
                                ))}
                                {agamaLainnya.fields.length < 7 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-fit"
                                        onClick={() =>
                                            agamaLainnya.append({
                                                nomorAnggota: 1,
                                                agamaSemula: "",
                                                agamaMenjadi: "",
                                                dasarPerubahanAgama: "",
                                                namaElemenLainnya: "",
                                                lainnyaSemula: "",
                                                lainnyaMenjadi: "",
                                                dasarPerubahanLainnya: "",
                                                keterangan: "",
                                            })
                                        }
                                    >
                                        <Plus />
                                        Tambah Baris Perubahan
                                    </Button>
                                )}
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
