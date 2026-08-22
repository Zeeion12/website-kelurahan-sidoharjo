import { Lora } from "next/font/google";

export const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const inputClass =
  "mt-1.5 block w-full rounded-sm border border-[#1E2A4A]/20 bg-white px-3 py-2 text-sm text-[#1E2A4A] outline-none focus:border-[#9B2C2C] focus:ring-1 focus:ring-[#9B2C2C]/40";

export const errorInputClass =
  "mt-1.5 block w-full rounded-sm border border-[#9B2C2C] bg-white px-3 py-2 text-sm text-[#1E2A4A] outline-none focus:border-[#9B2C2C] focus:ring-1 focus:ring-[#9B2C2C]/40";

export function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export function Field({
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

export function RadioGroup({
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

export function Section({
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

export type Pelapor = {
  nama: string;
  nik: string;
  noDokumenPerjalanan: string;
  noKK: string;
  kewarganegaraan: string;
};

export const initialPelapor: Pelapor = {
  nama: "",
  nik: "",
  noDokumenPerjalanan: "",
  noKK: "",
  kewarganegaraan: "WNI",
};

export function PelaporFields({
  data,
  onChange,
  errors,
}: {
  data: Pelapor;
  onChange: (field: keyof Pelapor, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <Field label="Nama" required error={errors["pelapor.nama"]}>
        <input
          className={errors["pelapor.nama"] ? errorInputClass : inputClass}
          value={data.nama}
          onChange={(e) => onChange("nama", e.target.value)}
        />
      </Field>
      <Field label="NIK" required error={errors["pelapor.nik"]}>
        <input
          className={errors["pelapor.nik"] ? errorInputClass : inputClass}
          inputMode="numeric"
          value={data.nik}
          onChange={(e) => onChange("nik", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Nomor Dokumen Perjalanan" hint="Khusus WNA, kosongkan jika tidak ada">
        <input
          className={inputClass}
          value={data.noDokumenPerjalanan}
          onChange={(e) => onChange("noDokumenPerjalanan", e.target.value)}
        />
      </Field>
      <Field label="Nomor Kartu Keluarga" required error={errors["pelapor.noKK"]}>
        <input
          className={errors["pelapor.noKK"] ? errorInputClass : inputClass}
          inputMode="numeric"
          value={data.noKK}
          onChange={(e) => onChange("noKK", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Kewarganegaraan" required>
        <select
          className={inputClass}
          value={data.kewarganegaraan}
          onChange={(e) => onChange("kewarganegaraan", e.target.value)}
        >
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
      </Field>
    </>
  );
}

export type Subyek = {
  nama: string;
  nik: string;
  noDokumenPerjalanan: string;
  noKK: string;
  kewarganegaraan: string;
};

export const initialSubyek: Subyek = {
  nama: "",
  nik: "",
  noDokumenPerjalanan: "",
  noKK: "",
  kewarganegaraan: "WNI",
};

export function SubyekFields({
  data,
  onChange,
  prefixError,
  errors,
}: {
  data: Subyek;
  onChange: (field: keyof Subyek, value: string) => void;
  prefixError: string;
  errors: Record<string, string>;
}) {
  return (
    <>
      <Field label="Nama" required error={errors[`${prefixError}.nama`]}>
        <input
          className={errors[`${prefixError}.nama`] ? errorInputClass : inputClass}
          value={data.nama}
          onChange={(e) => onChange("nama", e.target.value)}
        />
      </Field>
      <Field label="NIK" required error={errors[`${prefixError}.nik`]}>
        <input
          className={errors[`${prefixError}.nik`] ? errorInputClass : inputClass}
          inputMode="numeric"
          value={data.nik}
          onChange={(e) => onChange("nik", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Nomor Dokumen Perjalanan" hint="Khusus WNA, kosongkan jika tidak ada">
        <input
          className={inputClass}
          value={data.noDokumenPerjalanan}
          onChange={(e) => onChange("noDokumenPerjalanan", e.target.value)}
        />
      </Field>
      <Field label="Nomor Kartu Keluarga">
        <input
          className={inputClass}
          inputMode="numeric"
          value={data.noKK}
          onChange={(e) => onChange("noKK", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Kewarganegaraan">
        <select
          className={inputClass}
          value={data.kewarganegaraan}
          onChange={(e) => onChange("kewarganegaraan", e.target.value)}
        >
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
      </Field>
    </>
  );
}

export type OrangTuaRingkas = {
  namaAyah: string;
  nikAyah: string;
  namaIbu: string;
  nikIbu: string;
};

export const initialOrtu: OrangTuaRingkas = {
  namaAyah: "",
  nikAyah: "",
  namaIbu: "",
  nikIbu: "",
};

export function OrtuRingkasFields({
  data,
  onChange,
}: {
  data: OrangTuaRingkas;
  onChange: (field: keyof OrangTuaRingkas, value: string) => void;
}) {
  return (
    <>
      <Field label="Nama Ayah">
        <input
          className={inputClass}
          value={data.namaAyah}
          onChange={(e) => onChange("namaAyah", e.target.value)}
        />
      </Field>
      <Field label="NIK Ayah">
        <input
          className={inputClass}
          inputMode="numeric"
          value={data.nikAyah}
          onChange={(e) => onChange("nikAyah", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Nama Ibu">
        <input
          className={inputClass}
          value={data.namaIbu}
          onChange={(e) => onChange("namaIbu", e.target.value)}
        />
      </Field>
      <Field label="NIK Ibu">
        <input
          className={inputClass}
          inputMode="numeric"
          value={data.nikIbu}
          onChange={(e) => onChange("nikIbu", onlyDigits(e.target.value, 16))}
        />
      </Field>
    </>
  );
}

export type Saksi = {
  nama: string;
  nik: string;
  noKK: string;
  kewarganegaraan: string;
};

export const initialSaksi: Saksi = {
  nama: "",
  nik: "",
  noKK: "",
  kewarganegaraan: "WNI",
};

export function SaksiFields({
  data,
  onChange,
  prefixError,
  errors,
}: {
  data: Saksi;
  onChange: (field: keyof Saksi, value: string) => void;
  prefixError: string;
  errors: Record<string, string>;
}) {
  return (
    <>
      <Field label="Nama" required error={errors[`${prefixError}.nama`]}>
        <input
          className={errors[`${prefixError}.nama`] ? errorInputClass : inputClass}
          value={data.nama}
          onChange={(e) => onChange("nama", e.target.value)}
        />
      </Field>
      <Field label="NIK" required error={errors[`${prefixError}.nik`]}>
        <input
          className={errors[`${prefixError}.nik`] ? errorInputClass : inputClass}
          inputMode="numeric"
          value={data.nik}
          onChange={(e) => onChange("nik", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Nomor Kartu Keluarga">
        <input
          className={inputClass}
          inputMode="numeric"
          value={data.noKK}
          onChange={(e) => onChange("noKK", onlyDigits(e.target.value, 16))}
        />
      </Field>
      <Field label="Kewarganegaraan">
        <select
          className={inputClass}
          value={data.kewarganegaraan}
          onChange={(e) => onChange("kewarganegaraan", e.target.value)}
        >
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
      </Field>
    </>
  );
}

export type DataPerkawinan = {
  statusSebelumKawin: string;
  perkawinanYangKe: string;
  istriYangKe: string;
  tanggalPembatalanPerkawinan: string;
  tanggalMelapor: string;
  jamPelaporan: string;
  agama: string;
  kepercayaan: string;
  namaOrganisasiKepercayaan: string;
  namaPengadilan: string;
  nomorPenetapanPengadilan: string;
  tanggalPenetapanPengadilan: string;
  namaPemukaAgama: string;
  nomorSuratIzinPerwakilan: string;
  nomorPaspor: string;
  perjanjianNotaris: string;
  nomorAktaNotaris: string;
  tanggalAktaNotaris: string;
  jumlahAnak: string;
};

export const initialDataPerkawinan: DataPerkawinan = {
  statusSebelumKawin: "",
  perkawinanYangKe: "",
  istriYangKe: "",
  tanggalPembatalanPerkawinan: "",
  tanggalMelapor: "",
  jamPelaporan: "",
  agama: "",
  kepercayaan: "",
  namaOrganisasiKepercayaan: "",
  namaPengadilan: "",
  nomorPenetapanPengadilan: "",
  tanggalPenetapanPengadilan: "",
  namaPemukaAgama: "",
  nomorSuratIzinPerwakilan: "",
  nomorPaspor: "",
  perjanjianNotaris: "",
  nomorAktaNotaris: "",
  tanggalAktaNotaris: "",
  jumlahAnak: "",
};

export function PerkawinanFields({
  data,
  onChange,
  errors,
  showTanggalPembatalan,
}: {
  data: DataPerkawinan;
  onChange: (field: keyof DataPerkawinan, value: string) => void;
  errors: Record<string, string>;
  showTanggalPembatalan?: boolean;
}) {
  return (
    <>
      <Field
        label="Status Perkawinan Sebelum Kawin"
        required
        error={errors["perkawinan.statusSebelumKawin"]}
      >
        <RadioGroup
          name="statusSebelumKawin"
          options={["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati"]}
          value={data.statusSebelumKawin}
          onChange={(v) => onChange("statusSebelumKawin", v)}
        />
      </Field>
      <Field label="Perkawinan yang ke">
        <input
          type="number"
          min="1"
          className={inputClass}
          value={data.perkawinanYangKe}
          onChange={(e) => onChange("perkawinanYangKe", e.target.value)}
        />
      </Field>
      <Field label="Istri yang ke" hint="Bagi yang poligami">
        <input
          type="number"
          min="1"
          className={inputClass}
          value={data.istriYangKe}
          onChange={(e) => onChange("istriYangKe", e.target.value)}
        />
      </Field>
      {showTanggalPembatalan && (
        <Field
          label="Tanggal Pembatalan Perkawinan"
          required
          error={errors["perkawinan.tanggalPembatalanPerkawinan"]}
        >
          <input
            type="date"
            className={
              errors["perkawinan.tanggalPembatalanPerkawinan"]
                ? errorInputClass
                : inputClass
            }
            value={data.tanggalPembatalanPerkawinan}
            onChange={(e) => onChange("tanggalPembatalanPerkawinan", e.target.value)}
          />
        </Field>
      )}
      <Field label="Tanggal Melapor" required error={errors["perkawinan.tanggalMelapor"]}>
        <input
          type="date"
          className={errors["perkawinan.tanggalMelapor"] ? errorInputClass : inputClass}
          value={data.tanggalMelapor}
          onChange={(e) => onChange("tanggalMelapor", e.target.value)}
        />
      </Field>
      <Field label="Jam Pelaporan" required error={errors["perkawinan.jamPelaporan"]}>
        <input
          type="time"
          className={errors["perkawinan.jamPelaporan"] ? errorInputClass : inputClass}
          value={data.jamPelaporan}
          onChange={(e) => onChange("jamPelaporan", e.target.value)}
        />
      </Field>
      <Field label="Agama" required error={errors["perkawinan.agama"]}>
        <RadioGroup
          name="agama"
          options={["Islam", "Kristen", "Katholik", "Hindu", "Budha", "Konghuchu"]}
          value={data.agama}
          onChange={(v) => onChange("agama", v)}
        />
      </Field>
      <Field label="Kepercayaan" hint="Bagi penghayat kepercayaan">
        <input
          className={inputClass}
          value={data.kepercayaan}
          onChange={(e) => onChange("kepercayaan", e.target.value)}
        />
      </Field>
      <Field label="Nama Organisasi Kepercayaan">
        <input
          className={inputClass}
          value={data.namaOrganisasiKepercayaan}
          onChange={(e) => onChange("namaOrganisasiKepercayaan", e.target.value)}
        />
      </Field>
      <Field label="Nama Pengadilan" hint="Bila melalui penetapan pengadilan">
        <input
          className={inputClass}
          value={data.namaPengadilan}
          onChange={(e) => onChange("namaPengadilan", e.target.value)}
        />
      </Field>
      <Field label="Nomor Penetapan Pengadilan">
        <input
          className={inputClass}
          value={data.nomorPenetapanPengadilan}
          onChange={(e) => onChange("nomorPenetapanPengadilan", e.target.value)}
        />
      </Field>
      <Field label="Tanggal Penetapan Pengadilan">
        <input
          type="date"
          className={inputClass}
          value={data.tanggalPenetapanPengadilan}
          onChange={(e) => onChange("tanggalPenetapanPengadilan", e.target.value)}
        />
      </Field>
      <Field label="Nama Pemuka Agama/Kepercayaan">
        <input
          className={inputClass}
          value={data.namaPemukaAgama}
          onChange={(e) => onChange("namaPemukaAgama", e.target.value)}
        />
      </Field>
      <Field label="Nomor Surat Izin dari Perwakilan" hint="Bagi perkawinan di luar negeri">
        <input
          className={inputClass}
          value={data.nomorSuratIzinPerwakilan}
          onChange={(e) => onChange("nomorSuratIzinPerwakilan", e.target.value)}
        />
      </Field>
      <Field label="Nomor Paspor">
        <input
          className={inputClass}
          value={data.nomorPaspor}
          onChange={(e) => onChange("nomorPaspor", e.target.value)}
        />
      </Field>
      <Field label="Perjanjian Perkawinan dibuat oleh Notaris">
        <RadioGroup
          name="perjanjianNotaris"
          options={["Ya", "Tidak"]}
          value={data.perjanjianNotaris}
          onChange={(v) => onChange("perjanjianNotaris", v)}
        />
      </Field>
      {data.perjanjianNotaris === "Ya" && (
        <>
          <Field label="Nomor Akta Notaris">
            <input
              className={inputClass}
              value={data.nomorAktaNotaris}
              onChange={(e) => onChange("nomorAktaNotaris", e.target.value)}
            />
          </Field>
          <Field label="Tanggal Akta Notaris">
            <input
              type="date"
              className={inputClass}
              value={data.tanggalAktaNotaris}
              onChange={(e) => onChange("tanggalAktaNotaris", e.target.value)}
            />
          </Field>
        </>
      )}
      <Field
        label="Jumlah Anak"
        hint="Jika ada, agar mengisi formulir tambahan nama anak dan akta kelahiran anak"
      >
        <input
          type="number"
          min="0"
          className={inputClass}
          value={data.jumlahAnak}
          onChange={(e) => onChange("jumlahAnak", e.target.value)}
        />
      </Field>
    </>
  );
}