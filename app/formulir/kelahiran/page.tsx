"use client";

import Link from "next/link";
import { useState } from "react";
import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function getHari(tanggal: string) {
  if (!tanggal) return "";
  const d = new Date(`${tanggal}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return HARI[d.getDay()];
}

type Pelapor = {
  nama: string;
  nik: string;
  noDokumenPerjalanan: string;
  noKK: string;
  kewarganegaraan: string;
};

type Anak = {
  nama: string;
  jenisKelamin: string;
  tempatDilahirkan: string;
  tempatDilahirkanLainnya: string;
  tempatKelahiran: string;
  tanggalLahir: string;
  pukul: string;
  jenisKelahiran: string;
  jenisKelahiranLainnya: string;
  kelahiranKe: string;
  penolongKelahiran: string;
  penolongKelahiranLainnya: string;
  beratBayi: string;
  panjangBayi: string;
};

type OrangTua = {
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  kewarganegaraan: string;
};

type Saksi = {
  nama: string;
  nik: string;
  noKK: string;
  kewarganegaraan: string;
};

type FormState = {
  pelapor: Pelapor;
  anak: Anak;
  ayah: OrangTua;
  ibu: OrangTua;
  saksi1: Saksi;
  saksi2: Saksi;
};

const initialState: FormState = {
  pelapor: { nama: "", nik: "", noDokumenPerjalanan: "", noKK: "", kewarganegaraan: "WNI" },
  anak: {
    nama: "",
    jenisKelamin: "",
    tempatDilahirkan: "",
    tempatDilahirkanLainnya: "",
    tempatKelahiran: "",
    tanggalLahir: "",
    pukul: "",
    jenisKelahiran: "",
    jenisKelahiranLainnya: "",
    kelahiranKe: "",
    penolongKelahiran: "",
    penolongKelahiranLainnya: "",
    beratBayi: "",
    panjangBayi: "",
  },
  ayah: { nama: "", nik: "", tempatLahir: "", tanggalLahir: "", kewarganegaraan: "WNI" },
  ibu: { nama: "", nik: "", tempatLahir: "", tanggalLahir: "", kewarganegaraan: "WNI" },
  saksi1: { nama: "", nik: "", noKK: "", kewarganegaraan: "WNI" },
  saksi2: { nama: "", nik: "", noKK: "", kewarganegaraan: "WNI" },
};

const inputClass =
  "mt-1.5 block w-full rounded-sm border border-[#1E2A4A]/20 bg-white px-3 py-2 text-sm text-[#1E2A4A] outline-none focus:border-[#9B2C2C] focus:ring-1 focus:ring-[#9B2C2C]/40";

const errorInputClass =
  "mt-1.5 block w-full rounded-sm border border-[#9B2C2C] bg-white px-3 py-2 text-sm text-[#1E2A4A] outline-none focus:border-[#9B2C2C] focus:ring-1 focus:ring-[#9B2C2C]/40";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#1E2A4A]">
        {label} {required && <span className="text-[#9B2C2C]">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#1E2A4A]/50">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-[#9B2C2C]">{error}</span>}
    </label>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-[#1E2A4A]">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="h-4 w-4 accent-[#9B2C2C]"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-[#1E2A4A]/15 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-dashed border-[#1E2A4A]/20 pb-3">
        <h2 className={`${lora.className} text-lg font-semibold text-[#1E2A4A]`}>{title}</h2>
        {hint && <p className="mt-1 text-xs text-[#1E2A4A]/50">{hint}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export default function FormKelahiranPage() {
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
      ["anak", "nama", "Nama anak"],
      ["anak", "jenisKelamin", "Jenis kelamin"],
      ["anak", "tempatDilahirkan", "Tempat dilahirkan"],
      ["anak", "tempatKelahiran", "Tempat kelahiran"],
      ["anak", "tanggalLahir", "Tanggal lahir"],
      ["anak", "pukul", "Pukul"],
      ["anak", "jenisKelahiran", "Jenis kelahiran"],
      ["anak", "penolongKelahiran", "Penolong kelahiran"],
      ["anak", "beratBayi", "Berat bayi"],
      ["anak", "panjangBayi", "Panjang bayi"],
      ["ayah", "nama", "Nama ayah"],
      ["ayah", "nik", "NIK ayah"],
      ["ibu", "nama", "Nama ibu"],
      ["ibu", "nik", "NIK ibu"],
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const errorCount = Object.keys(errors).length;
  const hari = getHari(form.anak.tanggalLahir);

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
            Formulir Pelaporan Kelahiran
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#1E2A4A]/70 md:text-base">
            Lengkapi data pelapor, data anak, data orang tua, dan data saksi
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
          <Section title="Data Pelapor" hint="Orang yang melaporkan peristiwa kelahiran ini">
            <Field label="Nama" required error={errors["pelapor.nama"]}>
              <input
                className={errors["pelapor.nama"] ? errorInputClass : inputClass}
                value={form.pelapor.nama}
                onChange={(e) => update("pelapor", "nama", e.target.value)}
              />
            </Field>
            <Field label="NIK" required error={errors["pelapor.nik"]}>
              <input
                className={errors["pelapor.nik"] ? errorInputClass : inputClass}
                inputMode="numeric"
                value={form.pelapor.nik}
                onChange={(e) => update("pelapor", "nik", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field
              label="Nomor Dokumen Perjalanan"
              hint="Khusus WNA, kosongkan jika tidak ada"
            >
              <input
                className={inputClass}
                value={form.pelapor.noDokumenPerjalanan}
                onChange={(e) => update("pelapor", "noDokumenPerjalanan", e.target.value)}
              />
            </Field>
            <Field label="Nomor Kartu Keluarga" required error={errors["pelapor.noKK"]}>
              <input
                className={errors["pelapor.noKK"] ? errorInputClass : inputClass}
                inputMode="numeric"
                value={form.pelapor.noKK}
                onChange={(e) => update("pelapor", "noKK", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Kewarganegaraan" required>
              <select
                className={inputClass}
                value={form.pelapor.kewarganegaraan}
                onChange={(e) => update("pelapor", "kewarganegaraan", e.target.value)}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
          </Section>

          <Section title="Data Anak" hint="Subyek yang dilaporkan kelahirannya">
            <Field label="Nama" required error={errors["anak.nama"]}>
              <input
                className={errors["anak.nama"] ? errorInputClass : inputClass}
                value={form.anak.nama}
                onChange={(e) => update("anak", "nama", e.target.value)}
              />
            </Field>
            <Field label="Jenis Kelamin" required error={errors["anak.jenisKelamin"]}>
              <RadioGroup
                name="jenisKelamin"
                options={["Laki-laki", "Perempuan"]}
                value={form.anak.jenisKelamin}
                onChange={(v) => update("anak", "jenisKelamin", v)}
              />
            </Field>
            <Field
              label="Tempat Dilahirkan"
              required
              error={errors["anak.tempatDilahirkan"]}
            >
              <RadioGroup
                name="tempatDilahirkan"
                options={["RS/Bidan", "Puskesmas", "Polides", "Rumah", "Lainnya"]}
                value={form.anak.tempatDilahirkan}
                onChange={(v) => update("anak", "tempatDilahirkan", v)}
              />
              {form.anak.tempatDilahirkan === "Lainnya" && (
                <input
                  className={inputClass}
                  placeholder="Sebutkan tempat dilahirkan"
                  value={form.anak.tempatDilahirkanLainnya}
                  onChange={(e) => update("anak", "tempatDilahirkanLainnya", e.target.value)}
                />
              )}
            </Field>
            <Field
              label="Tempat Kelahiran"
              required
              hint="Kabupaten/Kota tempat peristiwa kelahiran terjadi"
              error={errors["anak.tempatKelahiran"]}
            >
              <input
                className={errors["anak.tempatKelahiran"] ? errorInputClass : inputClass}
                value={form.anak.tempatKelahiran}
                onChange={(e) => update("anak", "tempatKelahiran", e.target.value)}
              />
            </Field>
            <Field
              label="Tanggal Lahir"
              required
              hint={hari ? `Hari: ${hari}` : undefined}
              error={errors["anak.tanggalLahir"]}
            >
              <input
                type="date"
                className={errors["anak.tanggalLahir"] ? errorInputClass : inputClass}
                value={form.anak.tanggalLahir}
                onChange={(e) => update("anak", "tanggalLahir", e.target.value)}
              />
            </Field>
            <Field label="Pukul" required error={errors["anak.pukul"]}>
              <input
                type="time"
                className={errors["anak.pukul"] ? errorInputClass : inputClass}
                value={form.anak.pukul}
                onChange={(e) => update("anak", "pukul", e.target.value)}
              />
            </Field>
            <Field
              label="Jenis Kelahiran"
              required
              error={errors["anak.jenisKelahiran"]}
            >
              <RadioGroup
                name="jenisKelahiran"
                options={["Tunggal", "Kembar 2", "Kembar 3", "Kembar 4", "Lainnya"]}
                value={form.anak.jenisKelahiran}
                onChange={(v) => update("anak", "jenisKelahiran", v)}
              />
              {form.anak.jenisKelahiran === "Lainnya" && (
                <input
                  className={inputClass}
                  placeholder="Sebutkan jenis kelahiran"
                  value={form.anak.jenisKelahiranLainnya}
                  onChange={(e) => update("anak", "jenisKelahiranLainnya", e.target.value)}
                />
              )}
            </Field>
            <Field label="Kelahiran ke" hint="Anak keberapa dari orang tua">
              <input
                type="number"
                min="1"
                className={inputClass}
                value={form.anak.kelahiranKe}
                onChange={(e) => update("anak", "kelahiranKe", e.target.value)}
              />
            </Field>
            <Field
              label="Penolong Kelahiran"
              required
              error={errors["anak.penolongKelahiran"]}
            >
              <RadioGroup
                name="penolongKelahiran"
                options={["Dokter", "Bidan/Perawat", "Dukun", "Lainnya"]}
                value={form.anak.penolongKelahiran}
                onChange={(v) => update("anak", "penolongKelahiran", v)}
              />
              {form.anak.penolongKelahiran === "Lainnya" && (
                <input
                  className={inputClass}
                  placeholder="Sebutkan penolong kelahiran"
                  value={form.anak.penolongKelahiranLainnya}
                  onChange={(e) => update("anak", "penolongKelahiranLainnya", e.target.value)}
                />
              )}
            </Field>
            <Field label="Berat Bayi (Kg)" required error={errors["anak.beratBayi"]}>
              <input
                type="number"
                step="0.01"
                min="0"
                className={errors["anak.beratBayi"] ? errorInputClass : inputClass}
                value={form.anak.beratBayi}
                onChange={(e) => update("anak", "beratBayi", e.target.value)}
              />
            </Field>
            <Field label="Panjang Bayi (Cm)" required error={errors["anak.panjangBayi"]}>
              <input
                type="number"
                step="0.1"
                min="0"
                className={errors["anak.panjangBayi"] ? errorInputClass : inputClass}
                value={form.anak.panjangBayi}
                onChange={(e) => update("anak", "panjangBayi", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="Data Orang Tua — Ayah">
            <Field label="Nama Ayah" required error={errors["ayah.nama"]}>
              <input
                className={errors["ayah.nama"] ? errorInputClass : inputClass}
                value={form.ayah.nama}
                onChange={(e) => update("ayah", "nama", e.target.value)}
              />
            </Field>
            <Field label="NIK Ayah" required error={errors["ayah.nik"]}>
              <input
                className={errors["ayah.nik"] ? errorInputClass : inputClass}
                inputMode="numeric"
                value={form.ayah.nik}
                onChange={(e) => update("ayah", "nik", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Tempat Lahir Ayah">
              <input
                className={inputClass}
                value={form.ayah.tempatLahir}
                onChange={(e) => update("ayah", "tempatLahir", e.target.value)}
              />
            </Field>
            <Field label="Tanggal Lahir Ayah">
              <input
                type="date"
                className={inputClass}
                value={form.ayah.tanggalLahir}
                onChange={(e) => update("ayah", "tanggalLahir", e.target.value)}
              />
            </Field>
            <Field label="Kewarganegaraan Ayah">
              <select
                className={inputClass}
                value={form.ayah.kewarganegaraan}
                onChange={(e) => update("ayah", "kewarganegaraan", e.target.value)}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
          </Section>

          <Section title="Data Orang Tua — Ibu">
            <Field label="Nama Ibu" required error={errors["ibu.nama"]}>
              <input
                className={errors["ibu.nama"] ? errorInputClass : inputClass}
                value={form.ibu.nama}
                onChange={(e) => update("ibu", "nama", e.target.value)}
              />
            </Field>
            <Field label="NIK Ibu" required error={errors["ibu.nik"]}>
              <input
                className={errors["ibu.nik"] ? errorInputClass : inputClass}
                inputMode="numeric"
                value={form.ibu.nik}
                onChange={(e) => update("ibu", "nik", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Tempat Lahir Ibu">
              <input
                className={inputClass}
                value={form.ibu.tempatLahir}
                onChange={(e) => update("ibu", "tempatLahir", e.target.value)}
              />
            </Field>
            <Field label="Tanggal Lahir Ibu">
              <input
                type="date"
                className={inputClass}
                value={form.ibu.tanggalLahir}
                onChange={(e) => update("ibu", "tanggalLahir", e.target.value)}
              />
            </Field>
            <Field label="Kewarganegaraan Ibu">
              <select
                className={inputClass}
                value={form.ibu.kewarganegaraan}
                onChange={(e) => update("ibu", "kewarganegaraan", e.target.value)}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
          </Section>

          <Section title="Data Saksi I">
            <Field label="Nama Saksi I" required error={errors["saksi1.nama"]}>
              <input
                className={errors["saksi1.nama"] ? errorInputClass : inputClass}
                value={form.saksi1.nama}
                onChange={(e) => update("saksi1", "nama", e.target.value)}
              />
            </Field>
            <Field label="NIK Saksi I" required error={errors["saksi1.nik"]}>
              <input
                className={errors["saksi1.nik"] ? errorInputClass : inputClass}
                inputMode="numeric"
                value={form.saksi1.nik}
                onChange={(e) => update("saksi1", "nik", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Nomor Kartu Keluarga">
              <input
                className={inputClass}
                inputMode="numeric"
                value={form.saksi1.noKK}
                onChange={(e) => update("saksi1", "noKK", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Kewarganegaraan">
              <select
                className={inputClass}
                value={form.saksi1.kewarganegaraan}
                onChange={(e) => update("saksi1", "kewarganegaraan", e.target.value)}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
          </Section>

          <Section title="Data Saksi II">
            <Field label="Nama Saksi II" required error={errors["saksi2.nama"]}>
              <input
                className={errors["saksi2.nama"] ? errorInputClass : inputClass}
                value={form.saksi2.nama}
                onChange={(e) => update("saksi2", "nama", e.target.value)}
              />
            </Field>
            <Field label="NIK Saksi II" required error={errors["saksi2.nik"]}>
              <input
                className={errors["saksi2.nik"] ? errorInputClass : inputClass}
                inputMode="numeric"
                value={form.saksi2.nik}
                onChange={(e) => update("saksi2", "nik", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Nomor Kartu Keluarga">
              <input
                className={inputClass}
                inputMode="numeric"
                value={form.saksi2.noKK}
                onChange={(e) => update("saksi2", "noKK", onlyDigits(e.target.value, 16))}
              />
            </Field>
            <Field label="Kewarganegaraan">
              <select
                className={inputClass}
                value={form.saksi2.kewarganegaraan}
                onChange={(e) => update("saksi2", "kewarganegaraan", e.target.value)}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </Field>
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