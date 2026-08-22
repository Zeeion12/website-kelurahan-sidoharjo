"use client";

import Link from "next/link";
import { useState } from "react";
import {
  lora,
  Section,
  Field,
  RadioGroup,
  inputClass,
  errorInputClass,
  PelaporFields,
  SaksiFields,
  initialPelapor,
  initialSaksi,
  type Pelapor,
  type Saksi,
} from "../_shared/perkawinan-shared";

type DataPelaporanLuarNegeri = {
  jenisPeristiwa: string;
  nomorSuratKeterangan: string;
  tanggalSuratKeterangan: string;
  kantorPerwakilan: string;
  nomorBuktiPencatatanNegaraSetempat: string;
  tanggalPenerbitanNegaraSetempat: string;
};

type FormState = {
  pelapor: Pelapor;
  pelaporan: DataPelaporanLuarNegeri;
  saksi1: Saksi;
  saksi2: Saksi;
};

const initialState: FormState = {
  pelapor: { ...initialPelapor },
  pelaporan: {
    jenisPeristiwa: "",
    nomorSuratKeterangan: "",
    tanggalSuratKeterangan: "",
    kantorPerwakilan: "",
    nomorBuktiPencatatanNegaraSetempat: "",
    tanggalPenerbitanNegaraSetempat: "",
  },
  saksi1: { ...initialSaksi },
  saksi2: { ...initialSaksi },
};

export default function FormPelaporanLuarNegeriPage() {
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
      ["pelaporan", "jenisPeristiwa", "Jenis peristiwa penting"],
      ["pelaporan", "nomorSuratKeterangan", "Nomor surat keterangan"],
      ["pelaporan", "tanggalSuratKeterangan", "Tanggal surat keterangan"],
      ["pelaporan", "kantorPerwakilan", "Kantor perwakilan"],
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
            Formulir Pelaporan Pencatatan Sipil dari Luar Wilayah NKRI
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#1E2A4A]/70 md:text-base">
            Lengkapi data pelapor, data peristiwa yang terjadi di luar
            negeri, dan data surat keterangan dari Perwakilan RI sesuai
            dokumen yang Bapak/Ibu miliki.
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

          <Section title="Data Peristiwa di Luar Negeri">
            <Field
              label="Jenis Peristiwa Penting"
              required
              error={errors["pelaporan.jenisPeristiwa"]}
            >
              <RadioGroup
                name="jenisPeristiwa"
                options={[
                  "Kelahiran",
                  "Perkawinan",
                  "Perceraian",
                  "Kematian",
                  "Pengangkatan Anak",
                  "Pelepasan Kewarganegaraan RI",
                ]}
                value={form.pelaporan.jenisPeristiwa}
                onChange={(v) => update("pelaporan", "jenisPeristiwa", v)}
              />
            </Field>
          </Section>

          <Section
            title="Data Surat Keterangan dari Perwakilan RI"
            hint="Kedutaan/Konsulat RI di negara setempat"
          >
            <Field
              label="Nomor Surat Keterangan"
              required
              error={errors["pelaporan.nomorSuratKeterangan"]}
            >
              <input
                className={
                  errors["pelaporan.nomorSuratKeterangan"] ? errorInputClass : inputClass
                }
                value={form.pelaporan.nomorSuratKeterangan}
                onChange={(e) => update("pelaporan", "nomorSuratKeterangan", e.target.value)}
              />
            </Field>
            <Field
              label="Tanggal Surat Keterangan"
              required
              error={errors["pelaporan.tanggalSuratKeterangan"]}
            >
              <input
                type="date"
                className={
                  errors["pelaporan.tanggalSuratKeterangan"] ? errorInputClass : inputClass
                }
                value={form.pelaporan.tanggalSuratKeterangan}
                onChange={(e) =>
                  update("pelaporan", "tanggalSuratKeterangan", e.target.value)
                }
              />
            </Field>
            <Field
              label="Kantor Perwakilan yang Melakukan Pencatatan"
              required
              error={errors["pelaporan.kantorPerwakilan"]}
            >
              <input
                className={
                  errors["pelaporan.kantorPerwakilan"] ? errorInputClass : inputClass
                }
                value={form.pelaporan.kantorPerwakilan}
                onChange={(e) => update("pelaporan", "kantorPerwakilan", e.target.value)}
              />
            </Field>
          </Section>

          <Section
            title="Data Bukti Pencatatan dari Negara Setempat"
            hint="Isi bila tersedia dokumen dari otoritas negara setempat"
          >
            <Field label="Nomor Bukti Pencatatan">
              <input
                className={inputClass}
                value={form.pelaporan.nomorBuktiPencatatanNegaraSetempat}
                onChange={(e) =>
                  update(
                    "pelaporan",
                    "nomorBuktiPencatatanNegaraSetempat",
                    e.target.value,
                  )
                }
              />
            </Field>
            <Field label="Tanggal Penerbitan">
              <input
                type="date"
                className={inputClass}
                value={form.pelaporan.tanggalPenerbitanNegaraSetempat}
                onChange={(e) =>
                  update("pelaporan", "tanggalPenerbitanNegaraSetempat", e.target.value)
                }
              />
            </Field>
          </Section>

          <Section title="Data Saksi I" hint="Isi bila tersedia">
            <SaksiFields
              data={form.saksi1}
              onChange={(field, value) => update("saksi1", field, value)}
              prefixError="saksi1"
              errors={errors}
            />
          </Section>

          <Section title="Data Saksi II" hint="Isi bila tersedia">
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
