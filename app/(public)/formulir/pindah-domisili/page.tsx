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
import {
    pindahDomisiliSchema,
    type PindahDomisiliFormInput,
} from "@/lib/validations/pindah-domisili.schema";
import { getJenisSuratById } from "@/config/jenis-surat";
import { savePengajuan } from "@/lib/pengajuan-client";

const jenisSurat = getJenisSuratById("pindah-domisili")!;

export default function PindahDomisiliFormPage() {
    const [nomorTiket, setNomorTiket] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PindahDomisiliFormInput>({
        resolver: zodResolver(pindahDomisiliSchema),
        defaultValues: {
            noKK: "",
            namaPemohon: "",
            nikPemohon: "",
            jenisPermohonan: "" as PindahDomisiliFormInput["jenisPermohonan"],
            alamatAsal: {
                padukuhan: "" as PindahDomisiliFormInput["alamatAsal"]["padukuhan"],
                rt: "",
                rw: "",
            },
            kodePosAsal: "55881",
            klasifikasiPindah: "" as PindahDomisiliFormInput["klasifikasiPindah"],
            alamatTujuan: {
                alamat: "",
                rt: "",
                rw: "",
                kalurahan: "",
                kapanewon: "",
                kabupaten: "",
                provinsi: "",
                kodePos: "",
            },
            alasanPindah: "" as PindahDomisiliFormInput["alasanPindah"],
            alasanPindahLainnya: "",
            keteranganPekerjaan: "",
            jenisKepindahan: "" as PindahDomisiliFormInput["jenisKepindahan"],
            statusKKTidakPindah: "" as PindahDomisiliFormInput["statusKKTidakPindah"],
            statusKKPindah: "" as PindahDomisiliFormInput["statusKKPindah"],
            daftarAnggotaPindah: [],
            rencanaPindahTanggal: "",
            namaSponsor: "",
            tipeSponsor: "" as PindahDomisiliFormInput["tipeSponsor"],
            alamatSponsor: "",
            nomorKitasKitap: "",
            tanggalMasaBerlakuKitas: "",
            negaraTujuan: "",
            kodeNegara: "",
            alamatTujuanLuarNegeri: "",
            penanggungJawab: "",
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "daftarAnggotaPindah" });
    const jenisPermohonan = watch("jenisPermohonan");
    const alasanPindah = watch("alasanPindah");
    const butuhDataOrangAsing =
        jenisPermohonan === "surat-keterangan-tempat-tinggal" ||
        jenisPermohonan === "orang-asing-tinggal-terbatas";
    const butuhDataLuarNegeri = jenisPermohonan === "surat-keterangan-pindah-luar-negeri";

    async function onSubmit(values: PindahDomisiliFormInput) {
        setSubmitError(null);
        try {
            const nomorTiket = await savePengajuan({ jenisSurat: "pindah-domisili", data: values });
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
                        <FormSection title="Data Pemohon">
                            <Field label="Nama Pemohon" htmlFor="namaPemohon" error={errors.namaPemohon?.message}>
                                <Input id="namaPemohon" {...register("namaPemohon")} />
                            </Field>
                            <Field label="NIK Pemohon" htmlFor="nikPemohon" error={errors.nikPemohon?.message}>
                                <Input
                                    id="nikPemohon"
                                    inputMode="numeric"
                                    maxLength={16}
                                    {...register("nikPemohon")}
                                />
                            </Field>
                            <Field label="Nomor KK" htmlFor="noKK" error={errors.noKK?.message}>
                                <Input id="noKK" inputMode="numeric" maxLength={16} {...register("noKK")} />
                            </Field>
                            <Field
                                label="Jenis Permohonan"
                                htmlFor="jenisPermohonan"
                                error={errors.jenisPermohonan?.message}
                            >
                                <Controller
                                    name="jenisPermohonan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="jenisPermohonan" className="w-full">
                                                <SelectValue placeholder="Pilih jenis permohonan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="surat-keterangan-pindah">
                                                    Surat Keterangan Pindah
                                                </SelectItem>
                                                <SelectItem value="surat-keterangan-pindah-luar-negeri">
                                                    Surat Keterangan Pindah Luar Negeri
                                                </SelectItem>
                                                <SelectItem value="surat-keterangan-tempat-tinggal">
                                                    Surat Keterangan Tempat Tinggal
                                                </SelectItem>
                                                <SelectItem value="orang-asing-tinggal-terbatas">
                                                    Orang Asing Tinggal Terbatas
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection title="Alamat Asal">
                            <Field
                                label="Padukuhan"
                                htmlFor="alamatAsal.padukuhan"
                                error={errors.alamatAsal?.padukuhan?.message}
                            >
                                <Controller
                                    name="alamatAsal.padukuhan"
                                    control={control}
                                    render={({ field }) => (
                                        <PadukuhanSelect
                                            id="alamatAsal.padukuhan"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatAsal.rt"
                                    error={errors.alamatAsal?.rt?.message}
                                >
                                    <Input
                                        id="alamatAsal.rt"
                                        inputMode="numeric"
                                        maxLength={3}
                                        {...register("alamatAsal.rt")}
                                    />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatAsal.rw"
                                    error={errors.alamatAsal?.rw?.message}
                                >
                                    <Input
                                        id="alamatAsal.rw"
                                        inputMode="numeric"
                                        maxLength={3}
                                        {...register("alamatAsal.rw")}
                                    />
                                </Field>
                            </div>
                            <Field label="Kode Pos" htmlFor="kodePosAsal" error={errors.kodePosAsal?.message}>
                                <Input id="kodePosAsal" inputMode="numeric" maxLength={5} {...register("kodePosAsal")} />
                            </Field>
                            <Field
                                label="Klasifikasi Pindah"
                                htmlFor="klasifikasiPindah"
                                error={errors.klasifikasiPindah?.message}
                            >
                                <Controller
                                    name="klasifikasiPindah"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="klasifikasiPindah" className="w-full">
                                                <SelectValue placeholder="Pilih klasifikasi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dalam-satu-kalurahan">
                                                    Dalam Satu Kalurahan
                                                </SelectItem>
                                                <SelectItem value="antar-kalurahan-satu-kapanewon">
                                                    Antar Kalurahan Satu Kapanewon
                                                </SelectItem>
                                                <SelectItem value="antar-kapanewon-satu-kabupaten">
                                                    Antar Kapanewon Satu Kabupaten
                                                </SelectItem>
                                                <SelectItem value="antar-kabupaten-satu-provinsi">
                                                    Antar Kabupaten Satu Provinsi
                                                </SelectItem>
                                                <SelectItem value="antar-provinsi">Antar Provinsi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                        </FormSection>

                        <FormSection title="Alamat Tujuan">
                            <Field
                                label="Alamat"
                                htmlFor="alamatTujuan.alamat"
                                error={errors.alamatTujuan?.alamat?.message}
                                className="sm:col-span-2"
                            >
                                <Input id="alamatTujuan.alamat" {...register("alamatTujuan.alamat")} />
                            </Field>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="RT"
                                    htmlFor="alamatTujuan.rt"
                                    error={errors.alamatTujuan?.rt?.message}
                                >
                                    <Input id="alamatTujuan.rt" {...register("alamatTujuan.rt")} />
                                </Field>
                                <Field
                                    label="RW"
                                    htmlFor="alamatTujuan.rw"
                                    error={errors.alamatTujuan?.rw?.message}
                                >
                                    <Input id="alamatTujuan.rw" {...register("alamatTujuan.rw")} />
                                </Field>
                            </div>
                            <Field
                                label="Kalurahan/Desa"
                                htmlFor="alamatTujuan.kalurahan"
                                error={errors.alamatTujuan?.kalurahan?.message}
                            >
                                <Input id="alamatTujuan.kalurahan" {...register("alamatTujuan.kalurahan")} />
                            </Field>
                            <Field
                                label="Kapanewon/Kecamatan"
                                htmlFor="alamatTujuan.kapanewon"
                                error={errors.alamatTujuan?.kapanewon?.message}
                            >
                                <Input id="alamatTujuan.kapanewon" {...register("alamatTujuan.kapanewon")} />
                            </Field>
                            <Field
                                label="Kabupaten/Kota"
                                htmlFor="alamatTujuan.kabupaten"
                                error={errors.alamatTujuan?.kabupaten?.message}
                            >
                                <Input id="alamatTujuan.kabupaten" {...register("alamatTujuan.kabupaten")} />
                            </Field>
                            <Field
                                label="Provinsi"
                                htmlFor="alamatTujuan.provinsi"
                                error={errors.alamatTujuan?.provinsi?.message}
                            >
                                <Input id="alamatTujuan.provinsi" {...register("alamatTujuan.provinsi")} />
                            </Field>
                            <Field
                                label="Kode Pos"
                                htmlFor="alamatTujuan.kodePos"
                                error={errors.alamatTujuan?.kodePos?.message}
                            >
                                <Input
                                    id="alamatTujuan.kodePos"
                                    inputMode="numeric"
                                    maxLength={5}
                                    {...register("alamatTujuan.kodePos")}
                                />
                            </Field>
                        </FormSection>

                        <FormSection title="Alasan & Jenis Kepindahan">
                            <Field
                                label="Alasan Pindah"
                                htmlFor="alasanPindah"
                                error={errors.alasanPindah?.message}
                            >
                                <Controller
                                    name="alasanPindah"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="alasanPindah" className="w-full">
                                                <SelectValue placeholder="Pilih alasan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pekerjaan">Pekerjaan</SelectItem>
                                                <SelectItem value="pendidikan">Pendidikan</SelectItem>
                                                <SelectItem value="keamanan">Keamanan</SelectItem>
                                                <SelectItem value="kesehatan">Kesehatan</SelectItem>
                                                <SelectItem value="perumahan">Perumahan</SelectItem>
                                                <SelectItem value="keluarga">Keluarga</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            {alasanPindah === "lainnya" && (
                                <Field
                                    label="Alasan Lainnya"
                                    htmlFor="alasanPindahLainnya"
                                    error={errors.alasanPindahLainnya?.message}
                                >
                                    <Input id="alasanPindahLainnya" {...register("alasanPindahLainnya")} />
                                </Field>
                            )}
                            <Field
                                label="Keterangan Pekerjaan"
                                htmlFor="keteranganPekerjaan"
                                hint="Opsional"
                                error={errors.keteranganPekerjaan?.message}
                            >
                                <Input id="keteranganPekerjaan" {...register("keteranganPekerjaan")} />
                            </Field>
                            <Field
                                label="Jenis Kepindahan"
                                htmlFor="jenisKepindahan"
                                error={errors.jenisKepindahan?.message}
                            >
                                <Controller
                                    name="jenisKepindahan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="jenisKepindahan" className="w-full">
                                                <SelectValue placeholder="Pilih jenis kepindahan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kepala-keluarga">Kepala Keluarga</SelectItem>
                                                <SelectItem value="kepala-keluarga-dan-sebagian-anggota">
                                                    Kepala Keluarga dan Sebagian Anggota
                                                </SelectItem>
                                                <SelectItem value="kepala-keluarga-dan-seluruh-anggota">
                                                    Kepala Keluarga dan Seluruh Anggota
                                                </SelectItem>
                                                <SelectItem value="anggota-keluarga">Anggota Keluarga</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Status KK yang Tidak Pindah"
                                htmlFor="statusKKTidakPindah"
                                error={errors.statusKKTidakPindah?.message}
                            >
                                <Controller
                                    name="statusKKTidakPindah"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="statusKKTidakPindah" className="w-full">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="numpang-kk">Numpang KK</SelectItem>
                                                <SelectItem value="membuat-kk-baru">Membuat KK Baru</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Status KK yang Pindah"
                                htmlFor="statusKKPindah"
                                error={errors.statusKKPindah?.message}
                            >
                                <Controller
                                    name="statusKKPindah"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="statusKKPindah" className="w-full">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="numpang-kk">Numpang KK</SelectItem>
                                                <SelectItem value="membuat-kk-baru">Membuat KK Baru</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field
                                label="Rencana Tanggal Pindah"
                                htmlFor="rencanaPindahTanggal"
                                error={errors.rencanaPindahTanggal?.message}
                            >
                                <Input
                                    id="rencanaPindahTanggal"
                                    type="date"
                                    {...register("rencanaPindahTanggal")}
                                />
                            </Field>
                        </FormSection>

                        <FormSection
                            title="Anggota yang Pindah"
                            description="Minimal 1 orang."
                        >
                            <div className="flex flex-col gap-4 sm:col-span-2">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-4 rounded-md border border-border p-3 sm:grid-cols-3"
                                    >
                                        <Field
                                            label="Nama Lengkap"
                                            htmlFor={`daftarAnggotaPindah.${index}.namaLengkap`}
                                            error={errors.daftarAnggotaPindah?.[index]?.namaLengkap?.message}
                                        >
                                            <Input
                                                id={`daftarAnggotaPindah.${index}.namaLengkap`}
                                                {...register(`daftarAnggotaPindah.${index}.namaLengkap`)}
                                            />
                                        </Field>
                                        <Field
                                            label="NIK"
                                            htmlFor={`daftarAnggotaPindah.${index}.nik`}
                                            error={errors.daftarAnggotaPindah?.[index]?.nik?.message}
                                        >
                                            <Input
                                                id={`daftarAnggotaPindah.${index}.nik`}
                                                inputMode="numeric"
                                                maxLength={16}
                                                {...register(`daftarAnggotaPindah.${index}.nik`)}
                                            />
                                        </Field>
                                        <Field
                                            label="Status Hubungan Keluarga"
                                            htmlFor={`daftarAnggotaPindah.${index}.shdk`}
                                            error={errors.daftarAnggotaPindah?.[index]?.shdk?.message}
                                        >
                                            <Controller
                                                name={`daftarAnggotaPindah.${index}.shdk`}
                                                control={control}
                                                render={({ field: shdkField }) => (
                                                    <Select
                                                        value={shdkField.value}
                                                        onValueChange={shdkField.onChange}
                                                    >
                                                        <SelectTrigger
                                                            id={`daftarAnggotaPindah.${index}.shdk`}
                                                            className="w-full"
                                                        >
                                                            <SelectValue placeholder="Pilih SHDK" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="kepala-keluarga">
                                                                Kepala Keluarga
                                                            </SelectItem>
                                                            <SelectItem value="suami">Suami</SelectItem>
                                                            <SelectItem value="istri">Istri</SelectItem>
                                                            <SelectItem value="anak">Anak</SelectItem>
                                                            <SelectItem value="menantu">Menantu</SelectItem>
                                                            <SelectItem value="cucu">Cucu</SelectItem>
                                                            <SelectItem value="orangtua">Orang Tua</SelectItem>
                                                            <SelectItem value="mertua">Mertua</SelectItem>
                                                            <SelectItem value="famili-lain">
                                                                Famili Lain
                                                            </SelectItem>
                                                            <SelectItem value="pembantu">Pembantu</SelectItem>
                                                            <SelectItem value="lainnya">Lainnya</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </Field>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="sm:col-span-3 sm:w-fit"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 />
                                            Hapus
                                        </Button>
                                    </div>
                                ))}
                                {errors.daftarAnggotaPindah?.root && (
                                    <p className="text-sm text-destructive">
                                        {errors.daftarAnggotaPindah.root.message}
                                    </p>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-fit"
                                    onClick={() => append({ nik: "", namaLengkap: "", shdk: "kepala-keluarga" })}
                                >
                                    <Plus />
                                    Tambah Anggota
                                </Button>
                            </div>
                        </FormSection>

                        {butuhDataOrangAsing && (
                            <FormSection
                                title="Data Orang Asing"
                                description="Wajib diisi untuk permohonan tempat tinggal / tinggal terbatas."
                            >
                                <Field
                                    label="Nama Sponsor"
                                    htmlFor="namaSponsor"
                                    error={errors.namaSponsor?.message}
                                >
                                    <Input id="namaSponsor" {...register("namaSponsor")} />
                                </Field>
                                <Field
                                    label="Tipe Sponsor"
                                    htmlFor="tipeSponsor"
                                    error={errors.tipeSponsor?.message}
                                >
                                    <Controller
                                        name="tipeSponsor"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger id="tipeSponsor" className="w-full">
                                                    <SelectValue placeholder="Pilih tipe sponsor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="organisasi">Organisasi</SelectItem>
                                                    <SelectItem value="pemerintah">Pemerintah</SelectItem>
                                                    <SelectItem value="perorangan">Perorangan</SelectItem>
                                                    <SelectItem value="tanpa-sponsor">Tanpa Sponsor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                                <Field
                                    label="Alamat Sponsor"
                                    htmlFor="alamatSponsor"
                                    hint="Opsional"
                                    error={errors.alamatSponsor?.message}
                                >
                                    <Input id="alamatSponsor" {...register("alamatSponsor")} />
                                </Field>
                                <Field
                                    label="Nomor KITAS/KITAP"
                                    htmlFor="nomorKitasKitap"
                                    error={errors.nomorKitasKitap?.message}
                                >
                                    <Input id="nomorKitasKitap" {...register("nomorKitasKitap")} />
                                </Field>
                                <Field
                                    label="Tanggal Masa Berlaku KITAS/KITAP"
                                    htmlFor="tanggalMasaBerlakuKitas"
                                    hint="Opsional"
                                    error={errors.tanggalMasaBerlakuKitas?.message}
                                >
                                    <Input
                                        id="tanggalMasaBerlakuKitas"
                                        type="date"
                                        {...register("tanggalMasaBerlakuKitas")}
                                    />
                                </Field>
                            </FormSection>
                        )}

                        {butuhDataLuarNegeri && (
                            <FormSection
                                title="Data Pindah Luar Negeri"
                                description="Wajib diisi untuk permohonan pindah ke luar negeri."
                            >
                                <Field
                                    label="Negara Tujuan"
                                    htmlFor="negaraTujuan"
                                    error={errors.negaraTujuan?.message}
                                >
                                    <Input id="negaraTujuan" {...register("negaraTujuan")} />
                                </Field>
                                <Field
                                    label="Kode Negara"
                                    htmlFor="kodeNegara"
                                    hint="Opsional"
                                    error={errors.kodeNegara?.message}
                                >
                                    <Input id="kodeNegara" {...register("kodeNegara")} />
                                </Field>
                                <Field
                                    label="Alamat Tujuan di Luar Negeri"
                                    htmlFor="alamatTujuanLuarNegeri"
                                    error={errors.alamatTujuanLuarNegeri?.message}
                                    className="sm:col-span-2"
                                >
                                    <Input
                                        id="alamatTujuanLuarNegeri"
                                        {...register("alamatTujuanLuarNegeri")}
                                    />
                                </Field>
                                <Field
                                    label="Penanggung Jawab"
                                    htmlFor="penanggungJawab"
                                    hint="Opsional"
                                    error={errors.penanggungJawab?.message}
                                >
                                    <Input id="penanggungJawab" {...register("penanggungJawab")} />
                                </Field>
                            </FormSection>
                        )}

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
