export {
  lora,
  Section,
  Field,
  RadioGroup,
  inputClass,
  errorInputClass,
  onlyDigits,
  PelaporFields,
  SubyekFields,
  SaksiFields,
  initialPelapor,
  initialSubyek,
  initialSaksi,
  type Pelapor,
  type Subyek,
  type Saksi,
} from "./perkawinan-shared";

import { Field, inputClass, errorInputClass } from "./perkawinan-shared";

export type DataPerceraian = {
  nomorAktaPerkawinan: string;
  tanggalAktaPerkawinan: string;
  tempatPencatatanPerkawinan: string;
  namaPengadilan: string;
  tanggalPutusanPengadilan: string;
  nomorPutusanPengadilan: string;
  nomorSuratPaniteraPengadilan: string;
  tanggalSuratKeteranganPanitera: string;
  tanggalMelapor: string;
};

export const initialDataPerceraian: DataPerceraian = {
  nomorAktaPerkawinan: "",
  tanggalAktaPerkawinan: "",
  tempatPencatatanPerkawinan: "",
  namaPengadilan: "",
  tanggalPutusanPengadilan: "",
  nomorPutusanPengadilan: "",
  nomorSuratPaniteraPengadilan: "",
  tanggalSuratKeteranganPanitera: "",
  tanggalMelapor: "",
};

export function PerceraianFields({
  data,
  onChange,
  errors,
}: {
  data: DataPerceraian;
  onChange: (field: keyof DataPerceraian, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <Field
        label="Nomor Akta Perkawinan"
        required
        error={errors["perceraian.nomorAktaPerkawinan"]}
      >
        <input
          className={
            errors["perceraian.nomorAktaPerkawinan"] ? errorInputClass : inputClass
          }
          value={data.nomorAktaPerkawinan}
          onChange={(e) => onChange("nomorAktaPerkawinan", e.target.value)}
        />
      </Field>
      <Field
        label="Tanggal Akta Perkawinan"
        required
        error={errors["perceraian.tanggalAktaPerkawinan"]}
      >
        <input
          type="date"
          className={
            errors["perceraian.tanggalAktaPerkawinan"] ? errorInputClass : inputClass
          }
          value={data.tanggalAktaPerkawinan}
          onChange={(e) => onChange("tanggalAktaPerkawinan", e.target.value)}
        />
      </Field>
      <Field label="Tempat Pencatatan Perkawinan">
        <input
          className={inputClass}
          value={data.tempatPencatatanPerkawinan}
          onChange={(e) => onChange("tempatPencatatanPerkawinan", e.target.value)}
        />
      </Field>
      <Field label="Nama Pengadilan" required error={errors["perceraian.namaPengadilan"]}>
        <input
          className={errors["perceraian.namaPengadilan"] ? errorInputClass : inputClass}
          value={data.namaPengadilan}
          onChange={(e) => onChange("namaPengadilan", e.target.value)}
        />
      </Field>
      <Field
        label="Tanggal Putusan Pengadilan"
        required
        error={errors["perceraian.tanggalPutusanPengadilan"]}
      >
        <input
          type="date"
          className={
            errors["perceraian.tanggalPutusanPengadilan"] ? errorInputClass : inputClass
          }
          value={data.tanggalPutusanPengadilan}
          onChange={(e) => onChange("tanggalPutusanPengadilan", e.target.value)}
        />
      </Field>
      <Field
        label="Nomor Putusan Pengadilan"
        required
        error={errors["perceraian.nomorPutusanPengadilan"]}
      >
        <input
          className={
            errors["perceraian.nomorPutusanPengadilan"] ? errorInputClass : inputClass
          }
          value={data.nomorPutusanPengadilan}
          onChange={(e) => onChange("nomorPutusanPengadilan", e.target.value)}
        />
      </Field>
      <Field label="Nomor Surat Panitera Pengadilan">
        <input
          className={inputClass}
          value={data.nomorSuratPaniteraPengadilan}
          onChange={(e) => onChange("nomorSuratPaniteraPengadilan", e.target.value)}
        />
      </Field>
      <Field label="Tanggal Surat Keterangan Panitera Pengadilan">
        <input
          type="date"
          className={inputClass}
          value={data.tanggalSuratKeteranganPanitera}
          onChange={(e) => onChange("tanggalSuratKeteranganPanitera", e.target.value)}
        />
      </Field>
      <Field label="Tanggal Melapor" required error={errors["perceraian.tanggalMelapor"]}>
        <input
          type="date"
          className={errors["perceraian.tanggalMelapor"] ? errorInputClass : inputClass}
          value={data.tanggalMelapor}
          onChange={(e) => onChange("tanggalMelapor", e.target.value)}
        />
      </Field>
    </>
  );
}