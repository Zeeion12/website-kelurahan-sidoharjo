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
import { JenisKelaminRadio } from "@/components/forms/jenis-kelamin-radio";
import { KewarganegaraanRadio } from "@/components/forms/kewarganegaraan-radio";
import {
    pengantarNikahSchema,
    type PengantarNikahFormInput,
} from "@/lib/validations/pengantar-nikah.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("pengantar-nikah")!;

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

export default function PengantarNikahFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PengantarNikahFormInput>({
        resolver: zodResolver(pengantarNikahSchema),
        defaultValues: {
            namaPengaju: "",
            peranPemohon: "" as PengantarNikahFormInput["peranPemohon"],
            namaPemohon: "",
            nikPemohon: "",
            jenisKelaminPemohon: "" as PengantarNikahFormInput["jenisKelaminPemohon"],
            tempatLahirPemohon: "",
            tanggalLahirPemohon: "",
            kewarganegaraanPemohon: "wni",
            agamaPemohon: "" as PengantarNikahFormInput["agamaPemohon"],
            pekerjaanPemohon: "",
            alamatPemohon: {
                padukuhan: "" as PengantarNikahFormInput["alamatPemohon"]["padukuhan"],
                rt: "",
                rw: "",
            },
            statusPernikahanPemohon:
                "" as PengantarNikahFormInput["statusPernikahanPemohon"],
            istriKe: "",

            namaAyah: "",
            nikAyah: "",
            tempatLahirAyah: "",
            tanggalLahirAyah: "",
            kewarganegaraanAyah: "wni",
            agamaAyah: "" as PengantarNikahFormInput["agamaAyah"],
            pekerjaanAyah: "",
            alamatAyah: "",

            namaIbu: "",
            nikIbu: "",
            tempatLahirIbu: "",
            tanggalLahirIbu: "",
            kewarganegaraanIbu: "wni",
            agamaIbu: "" as PengantarNikahFormInput["agamaIbu"],
            pekerjaanIbu: "",
            alamatIbu: "",

            namaCalonPasangan: "",
            binBintiCalonPasangan: "",
            nikCalonPasangan: "",
            tempatLahirCalonPasangan: "",
            tanggalLahirCalonPasangan: "",
            kewarganegaraanCalonPasangan: "wni",
            agamaCalonPasangan: "" as PengantarNikahFormInput["agamaCalonPasangan"],
            pekerjaanCalonPasangan: "",
            alamatCalonPasangan: "",

            tanggalAkad: "",
            jamAkad: "",
            tempatAkad: "",
            kuaTujuan: "KUA Kapanewon Tepus",
            lampiranTambahan: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lampiranTambahan" as never,
    });

    const jenisKelaminPemohon = watch("jenisKelaminPemohon");
    const peranPemohon = watch("peranPemohon");

    const opsiStatusPernikahan =
        jenisKelaminPemohon === "perempuan"
            ? [
                  { value: "perawan", label: "Perawan" },
                  { value: "janda", label: "Janda" },
              ]
            : [
                  { value: "jejaka", label: "Jejaka" },
                  { value: "duda", label: "Duda" },
              ];

    async function onSubmit(values: PengantarNikahFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({
                jenisSurat: "pengantar-nikah",
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

                        <FormSection
                            title="Peran Pemohon"
                            description="Menentukan label Bin/Binti dan status pernikahan yang berlaku di dokumen."
                        >
                            <Field
                                label="Pemohon adalah"
                                htmlFor="peranPemohon"
                                error={errors.peranPemohon?.message}
                                className="sm:col-span-2"
                            >
                                <Controller
                                    name="peranPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="peranPemohon" className="w-full">
                                                <SelectValue placeholder="Pilih peran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="calon-suami">Calon Suami</SelectItem>
                                                <SelectItem value="calon-istri">Calon Istri</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Pemohon"
                            description="Warga Sidoharjo, sesuai KTP/KK -- subjek Model N1."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaPemohon"
                                error={errors.namaPemohon?.message}
                            >
                                <Input id="namaPemohon" {...register("namaPemohon")} />
                            </Field>
                            <Field label="NIK" htmlFor="nikPemohon" error={errors.nikPemohon?.message}>
                                <Input
                                    id="nikPemohon"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikPemohon")}
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
                                label="Kewarganegaraan"
                                htmlFor="kewarganegaraanPemohon"
                                error={errors.kewarganegaraanPemohon?.message}
                            >
                                <Controller
                                    name="kewarganegaraanPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <KewarganegaraanRadio
                                            id="kewarganegaraanPemohon"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
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
                            <Field
                                label="Status Pernikahan"
                                htmlFor="statusPernikahanPemohon"
                                error={errors.statusPernikahanPemohon?.message}
                                hint={
                                    !jenisKelaminPemohon
                                        ? "Pilih jenis kelamin dahulu"
                                        : undefined
                                }
                            >
                                <Controller
                                    name="statusPernikahanPemohon"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={!jenisKelaminPemohon}
                                        >
                                            <SelectTrigger id="statusPernikahanPemohon" className="w-full">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opsiStatusPernikahan.map((opsi) => (
                                                    <SelectItem key={opsi.value} value={opsi.value}>
                                                        {opsi.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            {peranPemohon === "calon-suami" && (
                                <Field
                                    label="Istri Ke (kalau sudah pernah menikah)"
                                    htmlFor="istriKe"
                                    error={errors.istriKe?.message}
                                >
                                    <Input
                                        id="istriKe"
                                        type="number"
                                        min={2}
                                        {...register("istriKe")}
                                    />
                                </Field>
                            )}
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
                            title="Data Ayah"
                            description="Boleh berdomisili di luar Sidoharjo."
                        >
                            <Field label="Nama Lengkap" htmlFor="namaAyah" error={errors.namaAyah?.message}>
                                <Input id="namaAyah" {...register("namaAyah")} />
                            </Field>
                            <Field label="NIK" htmlFor="nikAyah" error={errors.nikAyah?.message}>
                                <Input
                                    id="nikAyah"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikAyah")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirAyah"
                                error={errors.tempatLahirAyah?.message}
                            >
                                <Input id="tempatLahirAyah" {...register("tempatLahirAyah")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirAyah"
                                error={errors.tanggalLahirAyah?.message}
                            >
                                <Input id="tanggalLahirAyah" type="date" {...register("tanggalLahirAyah")} />
                            </Field>
                            <Field
                                label="Kewarganegaraan"
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
                            <Field label="Agama" htmlFor="agamaAyah" error={errors.agamaAyah?.message}>
                                <Controller
                                    name="agamaAyah"
                                    control={control}
                                    render={({ field }) => (
                                        <AgamaSelect
                                            id="agamaAyah"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaanAyah"
                                error={errors.pekerjaanAyah?.message}
                            >
                                <Input id="pekerjaanAyah" {...register("pekerjaanAyah")} />
                            </Field>
                            <Field
                                label="Alamat Lengkap"
                                htmlFor="alamatAyah"
                                error={errors.alamatAyah?.message}
                                className="sm:col-span-2"
                            >
                                <Input id="alamatAyah" {...register("alamatAyah")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Ibu"
                            description="Boleh berdomisili di luar Sidoharjo."
                        >
                            <Field label="Nama Lengkap" htmlFor="namaIbu" error={errors.namaIbu?.message}>
                                <Input id="namaIbu" {...register("namaIbu")} />
                            </Field>
                            <Field label="NIK" htmlFor="nikIbu" error={errors.nikIbu?.message}>
                                <Input
                                    id="nikIbu"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikIbu")}
                                />
                            </Field>
                            <Field
                                label="Tempat Lahir"
                                htmlFor="tempatLahirIbu"
                                error={errors.tempatLahirIbu?.message}
                            >
                                <Input id="tempatLahirIbu" {...register("tempatLahirIbu")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir"
                                htmlFor="tanggalLahirIbu"
                                error={errors.tanggalLahirIbu?.message}
                            >
                                <Input id="tanggalLahirIbu" type="date" {...register("tanggalLahirIbu")} />
                            </Field>
                            <Field
                                label="Kewarganegaraan"
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
                            <Field label="Agama" htmlFor="agamaIbu" error={errors.agamaIbu?.message}>
                                <Controller
                                    name="agamaIbu"
                                    control={control}
                                    render={({ field }) => (
                                        <AgamaSelect
                                            id="agamaIbu"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Pekerjaan"
                                htmlFor="pekerjaanIbu"
                                error={errors.pekerjaanIbu?.message}
                            >
                                <Input id="pekerjaanIbu" {...register("pekerjaanIbu")} />
                            </Field>
                            <Field
                                label="Alamat Lengkap"
                                htmlFor="alamatIbu"
                                error={errors.alamatIbu?.message}
                                className="sm:col-span-2"
                            >
                                <Input id="alamatIbu" {...register("alamatIbu")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Data Calon Pasangan"
                            description="Untuk Model N2 dan N4. Boleh berdomisili di luar Sidoharjo."
                        >
                            <Field
                                label="Nama Lengkap"
                                htmlFor="namaCalonPasangan"
                                error={errors.namaCalonPasangan?.message}
                            >
                                <Input id="namaCalonPasangan" {...register("namaCalonPasangan")} />
                            </Field>
                            <Field
                                label="Bin/Binti (Nama Ayah)"
                                htmlFor="binBintiCalonPasangan"
                                error={errors.binBintiCalonPasangan?.message}
                            >
                                <Input
                                    id="binBintiCalonPasangan"
                                    {...register("binBintiCalonPasangan")}
                                />
                            </Field>
                            <Field
                                label="NIK"
                                htmlFor="nikCalonPasangan"
                                error={errors.nikCalonPasangan?.message}
                            >
                                <Input
                                    id="nikCalonPasangan"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikCalonPasangan")}
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
                                label="Alamat Lengkap"
                                htmlFor="alamatCalonPasangan"
                                error={errors.alamatCalonPasangan?.message}
                                className="sm:col-span-2"
                            >
                                <Input id="alamatCalonPasangan" {...register("alamatCalonPasangan")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Rencana Akad"
                            description="Untuk Model N2."
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
                            >
                                <Input id="tempatAkad" {...register("tempatAkad")} />
                            </Field>
                            <Field
                                label="KUA Tujuan"
                                htmlFor="kuaTujuan"
                                error={errors.kuaTujuan?.message}
                            >
                                <Input id="kuaTujuan" {...register("kuaTujuan")} />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Lampiran Tambahan"
                            description="Nomor 1-6 (surat pengantar, persetujuan, fotokopi KTP/akta/KK, pas foto) sudah baku di formulir cetak. Isi di sini kalau ada lampiran tambahan (maksimal 2)."
                        >
                            <div className="flex flex-col gap-3 sm:col-span-2">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <Input
                                            {...register(`lampiranTambahan.${index}` as const)}
                                            placeholder={`Lampiran tambahan ${index + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            aria-label="Hapus lampiran"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                {fields.length < 2 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="self-start"
                                        onClick={() => append("")}
                                    >
                                        <Plus />
                                        Tambah Lampiran
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
