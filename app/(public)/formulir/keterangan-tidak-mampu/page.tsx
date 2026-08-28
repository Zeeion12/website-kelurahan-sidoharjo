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
import { JenisKelaminRadio } from "@/components/forms/jenis-kelamin-radio";
import { PadukuhanSelect } from "@/components/forms/padukuhan-select";
import {
    keteranganTidakMampuSchema,
    type KeteranganTidakMampuFormInput,
} from "@/lib/validations/keterangan-tidak-mampu.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("keterangan-tidak-mampu")!;

export default function KeteranganTidakMampuFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<KeteranganTidakMampuFormInput>({
        resolver: zodResolver(keteranganTidakMampuSchema),
        defaultValues: {
            namaPengaju: "",
            namaPemohon: "",
            ktpPemohon: "",
            kkPemohon: "",
            jenisKelaminPemohon: "" as KeteranganTidakMampuFormInput["jenisKelaminPemohon"],
            tempatLahirPemohon: "",
            tanggalLahirPemohon: "",
            agamaPemohon: "" as KeteranganTidakMampuFormInput["agamaPemohon"],
            statusPerkawinanPemohon: "" as KeteranganTidakMampuFormInput["statusPerkawinanPemohon"],
            pekerjaanPemohon: "",
            pendidikanTerakhirPemohon: "" as KeteranganTidakMampuFormInput["pendidikanTerakhirPemohon"],
            alamatPemohon: {
                padukuhan: "" as KeteranganTidakMampuFormInput["alamatPemohon"]["padukuhan"],
                rt: "",
                rw: "",
            },
            keperluan: "" as KeteranganTidakMampuFormInput["keperluan"],
            penghasilanPerBulan: undefined,
            anggotaKeluarga: [],
            namaAnak: "",
            nikAnak: "",
            tempatLahirAnak: "",
            tanggalLahirAnak: "",
            jenisKelaminAnak: "" as KeteranganTidakMampuFormInput["jenisKelaminAnak"],
            namaSekolah: "",
            fakultasProdi: "",
            kelasSemester: "",
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "anggotaKeluarga" });
    const keperluan = watch("keperluan");

    async function onSubmit(values: KeteranganTidakMampuFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({
                jenisSurat: "keterangan-tidak-mampu",
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
                            title="Data Pemohon"
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
                                hint="Opsional"
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
                            title="Keperluan"
                            description="Untuk keperluan apa surat ini diajukan."
                        >
                            <Field label="Keperluan" htmlFor="keperluan" error={errors.keperluan?.message}>
                                <Controller
                                    name="keperluan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="keperluan" className="w-full">
                                                <SelectValue placeholder="Pilih keperluan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kis-bpjs-pbi">KIS/BPJS PBI</SelectItem>
                                                <SelectItem value="beasiswa">Beasiswa</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            {keperluan === "kis-bpjs-pbi" && (
                                <Field
                                    label="Penghasilan per Bulan (Rp)"
                                    htmlFor="penghasilanPerBulan"
                                    error={errors.penghasilanPerBulan?.message}
                                >
                                    <Input
                                        id="penghasilanPerBulan"
                                        type="number"
                                        {...register("penghasilanPerBulan")}
                                    />
                                </Field>
                            )}
                        </FormSection>

                        <FormSection
                            title="Anggota Keluarga"
                            description="Opsional -- tambahkan jika diperlukan untuk lampiran rekomendasi kepesertaan."
                        >
                            <div className="flex flex-col gap-4 sm:col-span-2">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-4 rounded-md border border-border p-3 sm:grid-cols-2"
                                    >
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
                                            label="Hubungan Keluarga"
                                            htmlFor={`anggotaKeluarga.${index}.hubunganKeluarga`}
                                            error={errors.anggotaKeluarga?.[index]?.hubunganKeluarga?.message}
                                        >
                                            <Input
                                                id={`anggotaKeluarga.${index}.hubunganKeluarga`}
                                                placeholder="Contoh: Anak, Istri"
                                                {...register(`anggotaKeluarga.${index}.hubunganKeluarga`)}
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
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="sm:col-span-2 sm:w-fit"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 />
                                            Hapus Anggota
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-fit"
                                    onClick={() =>
                                        append({ nama: "", nik: "", hubunganKeluarga: "", keterangan: "" })
                                    }
                                >
                                    <Plus />
                                    Tambah Anggota Keluarga
                                </Button>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Data Anak (Opsional)"
                            description="Isi hanya jika surat ini untuk keperluan sekolah/kuliah anak."
                        >
                            <Field
                                label="Nama Anak"
                                htmlFor="namaAnak"
                                hint="Opsional"
                                error={errors.namaAnak?.message}
                            >
                                <Input id="namaAnak" {...register("namaAnak")} />
                            </Field>
                            <Field
                                label="NIK Anak"
                                htmlFor="nikAnak"
                                hint="Opsional"
                                error={errors.nikAnak?.message}
                            >
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
                                hint="Opsional"
                                error={errors.tempatLahirAnak?.message}
                            >
                                <Input id="tempatLahirAnak" {...register("tempatLahirAnak")} />
                            </Field>
                            <Field
                                label="Tanggal Lahir Anak"
                                htmlFor="tanggalLahirAnak"
                                hint="Opsional"
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
                                hint="Opsional"
                                error={errors.jenisKelaminAnak?.message}
                            >
                                <Controller
                                    name="jenisKelaminAnak"
                                    control={control}
                                    render={({ field }) => (
                                        <JenisKelaminRadio
                                            id="jenisKelaminAnak"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <Field
                                label="Nama Sekolah/Universitas"
                                htmlFor="namaSekolah"
                                hint="Opsional"
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
