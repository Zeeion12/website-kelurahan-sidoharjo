"use client";

import Link from "next/link";
import { useState } from "react";
import {
  lora,
  Section,
  Field,
  inputClass,
  errorInputClass,
  onlyDigits,
  PelaporFields,
  SaksiFields,
  initialPelapor,
  initialSaksi,
  type Pelapor,
  type Saksi,
} from "../_shared/perkawinan-shared";

type DataAnakAngkat = {
  namaAnakAngkat: string;
  nomorAktaKelahiran: string;
  tanggalPenerbitanAktaKelahiran: string;
  dinasPenerbitAktaKelahiran: string;
};

type OrangTuaKandung = {
  namaIbuKandung: string;
  nikIbuKandung: string;
  kewarganegaraanIbuKandung: string;
  namaAyahKandung: string;
  nikAyahKandung: string;
  kewarganegaraanAyahKandung: string;
};

type OrangTuaAngkat = {
  namaIbuAngkat: string;
  nikIbuAngkat: string;
  pasporIbuAngkat: string;
  namaAyahAngkat: string;
  nikAyahAngkat: string;
  pasporAyahAngkat: string;
};

type DataPengadilan = {
  namaPengadilan: string;
  tanggalPenetapanPengadilan: string;
  nomorPenetapanPengadilan: string;
  namaLembagaPenetapan: string;
  tempatLembagaPenetapan: string;
};

type FormState = {
  pelapor: Pelapor;
  anakAngkat: DataAnakAngkat;
  ortuKandung: OrangTuaKandung;
  ortuAngkat: OrangTuaAngkat;
  pengadilan: DataPengadilan;
  saksi1: Saksi;
  saksi2: Saksi;
};

const initialState: FormState = {
  pelapor: { ...initialPelapor },
  anakAngkat: {
    namaAnakAngkat: "",
    nomorAktaKelahiran: "",
    tanggalPenerbitanAktaKelahiran: "",
    dinasPenerbitAktaKelahiran: "",
  },
  ortuKandung: {
    namaIbuKandung: "",
    nikIbuKandung: "",
    kewarganegaraanIbuKandung: "WNI",
    namaAyahKandung: "",
    nikAyahKandung: "",
    kewarganegaraanAyahKandung: "WNI",
  },
  ortuAngkat: {
    namaIbuAngkat: "",
    nikIbuAngkat: "",
    pasporIbuAngkat: "",
    namaAyahAngkat: "",
    nikAyahAngkat: "",
    pasporAyahAngkat: "",
  },
  pengadilan: {
    namaPengadilan: "",
    tanggalPenetapanPengadilan: "",
    nomorPenetapanPengadilan: "",
    namaLembagaPenetapan: "",
    tempatLembagaPenetapan: "",
  },
  saksi1: { ...initialSaksi },
  saksi2: { ...initialSaksi },
};

export default function FormPengangkatanAnakPage() {
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
      ["anakAngkat", "namaAnakAngkat", "Nama anak angkat"],
      ["anakAngkat", "nomorAktaKelahiran", "Nomor akta kelahiran"],
      ["ortuKandung", "namaIbuKandung", "Nama ibu kandung"],
      ["ortuKandung", "nikIbuKandung", "NIK ibu kandung"],
      ["ortuKandung", "namaAyahKandung", "Nama ayah kandung"],
      ["ortuKandung", "nikAyahKandung", "NIK ayah kandung"],
      ["ortuAngkat", "namaIbuAngkat", "Nama ibu angkat"],
      ["ortuAngkat", "nikIbuAngkat", "NIK ibu angkat"],
      ["ortuAngkat", "namaAyahAngkat", "Nama ayah angkat"],
      ["ortuAngkat", "nikAyahAngkat", "NIK ayah angkat"],
      ["pengadilan", "namaPengadilan", "Nama pengadilan"],
      ["pengadilan", "tanggalPenetapanPengadilan", "Tanggal penetapan pengadilan"],
      ["pengadilan", "nomorPenetapanPengadilan", "Nomor penetapan pengadilan"],
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
            Formulir Pencatatan Pengangkatan Anak
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#1E2A4A]/70 md:text-base">
            Lengkapi data pelapor, data anak angkat, data orang tua kandung
            dan orang tua angkat, data penetapan pengadilan, serta data saksi
            sesuai dokumen yang Bapak/Ibu miliki.
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

          <Section title="Data Anak Angkat">
            <Field
              label="Nama Anak Angkat"
              required
              error={errors["anakAngkat.namaAnakAngkat"]}
            >
              <input
                className={
                  errors["anakAngkat.namaAnakAngkat"] ? errorInputClass : inputClass
                }
                value={form.anakAngkat.namaAnakAngkat}
                onChange={(e) => update("anakAngkat", "namaAnakAngkat", e.target.value)}
              />
            </Field>
            <Field
              label="Nomor Akta Kelahiran"
              required
              error={errors["anakAngkat.nomorAktaKelahiran"]}
            >
              <input
                className={
                  errors["anakAngkat.nomorAktaKelahiran"] ? errorInputClass : inputClass
                }
                value={form.anakAngkat.nomorAktaKelahiran}
                onChange={(e) => update("anakAngkat", "nomorAktaKelahiran", e.target.value)}
              />
            </Field>
            <Field label="Tanggal Penerbitan Akta Kelahiran">
              <input
                type="date"
                className={inputClass}
                value={form.anakAngkat.tanggalPenerbitanAktaKelahiran}
                onChange={(e) =>
                  update("anakAngkat", "tanggalPenerbitanAktaKelahiran", e.target.value)
                }
              />
            </Field>
            <Field label="Dinas Kabupaten/Kota yang Menerbitkan">
              <input
                className={inputClass}
                value={form.anakAngkat.dinasPenerbitAktaKelahiran}
                onChange={(e) =>
                  update("anakAngkat", "dinasPenerbitAktaKelahiran", e.target.value)
                }
              />
            </Field>
          </Section>

          <Section title="Data Orang Tua Kandung">
            <Field
              label="Nama Ibu Kandung"
              required
              error={errors["ortuKandung.namaIbuKandung"]}
            >
              <input
                className={
                  errors["ortuKandung.namaIbuKandung"] ? errorInputClass : inputClass
                }
                value={form.ortuKandung.namaIbuKandung}
                onChange={(e) => update("ortuKandung", "namaIbuKandung", e.target.value)}
              />
            </Field>
            <Field
              label="NIK Ibu Kandung"
              required
              error={errors["ortuKandung.nikIbuKandung"]}
            >
              <input
                className={
                  errors["ortuKandung.nikIbuKandung"] ? errorInputClass : inputClass
                }
                inputMode="numeric"
                value={form.ortuKandung.nikIbuKandung}
                onChange={(e) =>
                  update("ortuKandung", "nikIbuKandung", onlyDigits(e.target.value, 16))
                }
              />
            </Field>
            <Field label="Kewarganegaraan Ibu Kandung">
              <select
                className={inputClass}
                value={form.ortuKandung.kewarganegaraanIbuKandung}
                onChange={(e) =>
                  update("ortuKandung", "kewarganegaraanIbuKandung", e.target.value)
                }
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
            <Field
              label="Nama Ayah Kandung"
              required
              error={errors["ortuKandung.namaAyahKandung"]}
            >
              <input
                className={
                  errors["ortuKandung.namaAyahKandung"] ? errorInputClass : inputClass
                }
                value={form.ortuKandung.namaAyahKandung}
                onChange={(e) => update("ortuKandung", "namaAyahKandung", e.target.value)}
              />
            </Field>
            <Field
              label="NIK Ayah Kandung"
              required
              error={errors["ortuKandung.nikAyahKandung"]}
            >
              <input
                className={
                  errors["ortuKandung.nikAyahKandung"] ? errorInputClass : inputClass
                }
                inputMode="numeric"
                value={form.ortuKandung.nikAyahKandung}
                onChange={(e) =>
                  update("ortuKandung", "nikAyahKandung", onlyDigits(e.target.value, 16))
                }
              />
            </Field>
            <Field label="Kewarganegaraan Ayah Kandung">
              <select
                className={inputClass}
                value={form.ortuKandung.kewarganegaraanAyahKandung}
                onChange={(e) =>
                  update("ortuKandung", "kewarganegaraanAyahKandung", e.target.value)
                }
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
          </Section>

          <Section title="Data Orang Tua Angkat">
            <Field
              label="Nama Ibu Angkat"
              required
              error={errors["ortuAngkat.namaIbuAngkat"]}
            >
              <input
                className={
                  errors["ortuAngkat.namaIbuAngkat"] ? errorInputClass : inputClass
                }
                value={form.ortuAngkat.namaIbuAngkat}
                onChange={(e) => update("ortuAngkat", "namaIbuAngkat", e.target.value)}
              />
            </Field>
            <Field
              label="NIK Ibu Angkat"
              required
              error={errors["ortuAngkat.nikIbuAngkat"]}
            >
              <input
                className={
                  errors["ortuAngkat.nikIbuAngkat"] ? errorInputClass : inputClass
                }
                inputMode="numeric"
                value={form.ortuAngkat.nikIbuAngkat}
                onChange={(e) =>
                  update("ortuAngkat", "nikIbuAngkat", onlyDigits(e.target.value, 16))
                }
              />
            </Field>
            <Field label="Nomor Paspor Ibu Angkat" hint="Khusus WNA">
              <input
                className={inputClass}
                value={form.ortuAngkat.pasporIbuAngkat}
                onChange={(e) => update("ortuAngkat", "pasporIbuAngkat", e.target.value)}
              />
            </Field>
            <Field
              label="Nama Ayah Angkat"
              required
              error={errors["ortuAngkat.namaAyahAngkat"]}
            >
              <input
                className={
                  errors["ortuAngkat.namaAyahAngkat"] ? errorInputClass : inputClass
                }
                value={form.ortuAngkat.namaAyahAngkat}
                onChange={(e) => update("ortuAngkat", "namaAyahAngkat", e.target.value)}
              />
            </Field>
            <Field
              label="NIK Ayah Angkat"
              required
              error={errors["ortuAngkat.nikAyahAngkat"]}
            >
              <input
                className={
                  errors["ortuAngkat.nikAyahAngkat"] ? errorInputClass : inputClass
                }
                inputMode="numeric"
                value={form.ortuAngkat.nikAyahAngkat}
                onChange={(e) =>
                  update("ortuAngkat", "nikAyahAngkat", onlyDigits(e.target.value, 16))
                }
              />
            </Field>
            <Field label="Nomor Paspor Ayah Angkat" hint="Khusus WNA">
              <input
                className={inputClass}
                value={form.ortuAngkat.pasporAyahAngkat}
                onChange={(e) => update("ortuAngkat", "pasporAyahAngkat", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="Data Penetapan Pengadilan">
            <Field
              label="Nama Pengadilan"
              required
              error={errors["pengadilan.namaPengadilan"]}
            >
              <input
                className={
                  errors["pengadilan.namaPengadilan"] ? errorInputClass : inputClass
                }
                value={form.pengadilan.namaPengadilan}
                onChange={(e) => update("pengadilan", "namaPengadilan", e.target.value)}
              />
            </Field>
            <Field
              label="Tanggal Penetapan Pengadilan"
              required
              error={errors["pengadilan.tanggalPenetapanPengadilan"]}
            >
              <input
                type="date"
                className={
                  errors["pengadilan.tanggalPenetapanPengadilan"]
                    ? errorInputClass
                    : inputClass
                }
                value={form.pengadilan.tanggalPenetapanPengadilan}
                onChange={(e) =>
                  update("pengadilan", "tanggalPenetapanPengadilan", e.target.value)
                }
              />
            </Field>
            <Field
              label="Nomor Penetapan Pengadilan"
              required
              error={errors["pengadilan.nomorPenetapanPengadilan"]}
            >
              <input
                className={
                  errors["pengadilan.nomorPenetapanPengadilan"]
                    ? errorInputClass
                    : inputClass
                }
                value={form.pengadilan.nomorPenetapanPengadilan}
                onChange={(e) =>
                  update("pengadilan", "nomorPenetapanPengadilan", e.target.value)
                }
              />
            </Field>
            <Field label="Nama Lembaga Penetapan Pengadilan">
              <input
                className={inputClass}
                value={form.pengadilan.namaLembagaPenetapan}
                onChange={(e) =>
                  update("pengadilan", "namaLembagaPenetapan", e.target.value)
                }
              />
            </Field>
            <Field label="Tempat Lembaga Penetapan Pengadilan">
              <input
                className={inputClass}
                value={form.pengadilan.tempatLembagaPenetapan}
                onChange={(e) =>
                  update("pengadilan", "tempatLembagaPenetapan", e.target.value)
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