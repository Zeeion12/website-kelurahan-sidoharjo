"use client";

import Link from "next/link";
import { useState } from "react";
import {
  lora,
  Section,
  Field,
  inputClass,
  errorInputClass,
  PelaporFields,
  SaksiFields,
  initialPelapor,
  initialSaksi,
  type Pelapor,
  type Saksi,
} from "../_shared/perkawinan-shared";

const JENIS_AKTA = [
  "Akta Kelahiran",
  "Akta Lahir Mati",
  "Akta Perkawinan",
  "Akta Perceraian",
  "Akta Kematian",
  "Akta Pengangkatan Anak",
  "Akta Pengakuan Anak",
  "Akta Pengesahan Anak",
  "Akta Perubahan Nama",
  "Akta Perubahan Kewarganegaraan",
  "Akta Peristiwa Penting Lainnya",
];

type DataPembatalanAkta = {
  jenisAkta: string;
  nomorAkta: string;
  nomorPutusanPengadilan: string;
  tanggalPutusanPengadilan: string;
  namaLembagaPengadilan: string;
};

type FormState = {
  pelapor: Pelapor;
  pembatalan: DataPembatalanAkta;
  saksi1: Saksi;
  saksi2: Saksi;
};

const initialState: FormState = {
  pelapor: { ...initialPelapor },
  pembatalan: {
    jenisAkta: "",
    nomorAkta: "",
    nomorPutusanPengadilan: "",
    tanggalPutusanPengadilan: "",
    namaLembagaPengadilan: "",
  },
  saksi1: { ...initialSaksi },
  saksi2: { ...initialSaksi },
};

export default function FormPembatalanAktaPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<G extends keyof FormState>(group: G, field: keyof FormState[G], value: string) {
    setForm((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  }

  function validate() {
    const required: [keyof FormState, string, string][] = [
      ["pelapor", "nama", "Nama pelapor"],
      ["pelapor", "nik", "NIK pelapor"],
      ["pelapor", "noKK", "Nomor KK pelapor"],
      ["pembatalan", "jenisAkta", "Jenis akta"],
      ["pembatalan", "nomorAkta", "Nomor akta yang dibatalkan"],
      ["pembatalan", "nomorPutusanPengadilan", "Nomor putusan pengadilan"],
      ["pembatalan", "tanggalPutusanPengadilan", "Tanggal putusan pengadilan"],
      ["saksi1", "nama", "Nama saksi I"],
      ["saksi1", "nik", "NIK saksi I"],
      ["saksi2", "nama", "Nama saksi II"],
      ["saksi2", "nik", "NIK saksi II"],
    ];

    const nextErrors: Record<string, string> = {};
    for (const [group, field, label] of required) {
      const groupValue = form[group] as unknown as Record<string, string>;
      if (!groupValue[field as string]?.trim()) {
        nextErrors[`${String(group)}.${String(field)}`] = `${label} wajib diisi`;
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = validate();
    setSubmitted(false);
    if (valid) {
      setSubmitted(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const errorCount = Object.keys(errors).length;

  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#1E2A4A]">
      <header className="border-b border-[#1E2A4A]/10 bg-white/60">
        <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <Link
            href="/formulir"
            className="text-xs font-medium text-[#9B2C2C] hover:underline"
          >
            ← Kembali ke pilihan jenis pelaporan
          </Link>
          <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#9B2C2C]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#9B2C2C]/40 text-[10px] font-semibold">
              F-2.01
            </span>
            Layanan Pencatatan Sipil — Kalurahan Sidoharjo
          </div>
          <h1 className={`${lora.className} mt-4 text-3xl font-semibold leading-tight md:text-4xl`}>
            Formulir Pembatalan Akta
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#1E2A4A]/70 md:text-base">
            Lengkapi data pelapor, data akta yang dibatalkan, data putusan
            pengadilan, serta data saksi sesuai dokumen yang Bapak/Ibu
            miliki.
          </p>
          <p className="mt-2 text-xs text-[#1E2A4A]/50">
            Field bertanda <span className="text-[#9B2C2C]">*</span> wajib diisi.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {submitted && (
          <div className="mb-6 rounded-sm border border-[#3B6D11]/30 bg-[#EAF3DE] px-4 py-3 text-sm text-[#27500A]">
            Formulir berhasil diisi dengan lengkap. (Penyimpanan ke sistem
            akan disambungkan pada tahap berikutnya.)
          </div>
        )}
        {!submitted && errorCount > 0 && (
          <div className="mb-6 rounded-sm border border-[#9B2C2C]/30 bg-[#FAECE7] px-4 py-3 text-sm text-[#4A1B0C]">
            Ada {errorCount} isian wajib yang belum diisi. Cek kembali field
            yang bergaris merah di bawah.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Section title="Data Pelapor" hint="Orang yang melaporkan peristiwa ini">
            <PelaporFields
              data={form.pelapor}
              onChange={(field, value) => update("pelapor", field, value)}
              errors={errors}
            />
          </Section>

          <Section title="Data Akta yang Dibatalkan">
            <Field label="Jenis Akta" required error={errors["pembatalan.jenisAkta"]}>
              <select
                className={
                  errors["pembatalan.jenisAkta"] ? errorInputClass : inputClass
                }
                value={form.pembatalan.jenisAkta}
                onChange={(e) => update("pembatalan", "jenisAkta", e.target.value)}
              >
                <option value="">Pilih jenis akta</option>
                {JENIS_AKTA.map((jenis) => (
                  <option key={jenis} value={jenis}>
                    {jenis}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Nomor Akta yang Dibatalkan"
              required
              error={errors["pembatalan.nomorAkta"]}
            >
              <input
                className={errors["pembatalan.nomorAkta"] ? errorInputClass : inputClass}
                value={form.pembatalan.nomorAkta}
                onChange={(e) => update("pembatalan", "nomorAkta", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="Data Putusan Pengadilan">
            <Field
              label="Nomor Putusan Pengadilan"
              required
              error={errors["pembatalan.nomorPutusanPengadilan"]}
            >
              <input
                className={
                  errors["pembatalan.nomorPutusanPengadilan"]
                    ? errorInputClass
                    : inputClass
                }
                value={form.pembatalan.nomorPutusanPengadilan}
                onChange={(e) =>
                  update("pembatalan", "nomorPutusanPengadilan", e.target.value)
                }
              />
            </Field>
            <Field
              label="Tanggal Putusan Pengadilan"
              required
              error={errors["pembatalan.tanggalPutusanPengadilan"]}
            >
              <input
                type="date"
                className={
                  errors["pembatalan.tanggalPutusanPengadilan"]
                    ? errorInputClass
                    : inputClass
                }
                value={form.pembatalan.tanggalPutusanPengadilan}
                onChange={(e) =>
                  update("pembatalan", "tanggalPutusanPengadilan", e.target.value)
                }
              />
            </Field>
            <Field label="Nama Lembaga Pengadilan">
              <input
                className={inputClass}
                value={form.pembatalan.namaLembagaPengadilan}
                onChange={(e) =>
                  update("pembatalan", "namaLembagaPengadilan", e.target.value)
                }
              />
            </Field>
          </Section>

          <Section title="Data Saksi I">
            <SaksiFields
              data={form.saksi1}
              onChange={(field, value) => update("saksi1", field, value)}
              prefixError="saksi1"
              errors={errors}
            />
          </Section>

          <Section title="Data Saksi II">
            <SaksiFields
              data={form.saksi2}
              onChange={(field, value) => update("saksi2", field, value)}
              prefixError="saksi2"
              errors={errors}
            />
          </Section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-sm bg-[#9B2C2C] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#7A2323]"
            >
              Simpan Formulir
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}