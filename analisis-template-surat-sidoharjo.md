# Analisis Template Surat — Kalurahan Sidoharjo, Kapanewon Tepus

Sumber: `Template_Surat.zip` (16 file). Semua kutipan di bawah diambil langsung dari file di zip.

---

## 0. Inventaris zip → pemetaan ke jenis surat Anda

| File di zip | Jenis dokumen sebenarnya | Relevan ke kode |
|---|---|---|
| `f1.01 kelahiran.xlsx` | Laporan Kelahiran (form lokal kalurahan, Umum/Terlambat) | KLH |
| `foam kelahiran dan kematian.xlsx` | **F-2.01** kosong, centang "Kelahiran" | KLH, LHM |
| `PENGANTAR KELAHIRANN.docx` | Surat pengantar Lurah → Dukcapil (Permohonan akta Kelahiran) | KLH (surat jadi) |
| `KEMATIAN.xlsx` | Laporan Pencatatan Kematian (form lokal) | KTN |
| `KEMATIAN F2.01.xlsx` | **F-2.01** terisi, centang "Kematian" | KTN, LHM |
| `PENGANTAR KEMATIAN.docx` | Surat pengantar Lurah → Dukcapil (Permohonan akta Kematian) | KTN (surat jadi) |
| `surat_ket_domisili_usaha_...rtf.doc` | Judul di dalamnya: **SURAT KETERANGAN USAHA** | SKU **dan** kandidat SIU |
| `bpjs 2024 pengantar KIS PBI.docx` | 4 dokumen dalam 1 file (lihat §5) termasuk **SURAT KETERANGAN TIDAK MAMPU** | SKTM, kandidat SKM |
| `F1.03 PINDAH.xlsx` | **F-1.03** Formulir Pendaftaran Perpindahan Penduduk | SKPD |
| `F-1.02-1.pdf` | **F-1.02** Formulir Pendaftaran Peristiwa Kependudukan (scan, tanpa text layer) | — |
| `F.106 PERUBAHAN.rtf.doc` | **F-1.06** Surat Pernyataan Perubahan Elemen Data | — |
| `FORM KK.rtf.doc` (+ 2 duplikat identik) | **F-1.01** Formulir Biodata Keluarga | — |
| `dispensasi nikah.docx` | Permohonan Dispensasi → Panewu | — (jenis surat baru) |
| `rekomendasi nikah.docx` | Surat Pengantar Mohon Rekomendasi Nikah | — (jenis surat baru) |
| `surat_pengantar_nikah_pria/wanita_473_...rtf.doc` | **Model N1** (Kepdirjen Bimas Islam 473/2020) | — (jenis surat baru) |
| `SK SOP kalurahan sidoharjo.pdf` | 13 SOP pelayanan (scan 42 hlm) | acuan alur, bukan template |

### ⚠️ Tiga temuan yang mengubah rencana Anda

1. **Tidak ada template "Surat Izin Usaha" di zip.** Yang ada hanya *Surat Keterangan Usaha*. Kalurahan tidak berwenang menerbitkan izin usaha (itu ranah OSS/DPMPT), jadi SIU di kalurahan Sidoharjo hampir pasti = SKU. Lihat §6.
2. **Tidak ada template "Surat Keterangan Mampu".** Baik di zip maupun di daftar 13 SOP. Lihat §8.
3. **Tidak ada surat keterangan pindah versi kalurahan.** Yang ada F-1.03, yaitu formulir Dukcapil yang ditandatangani **Kepala Dinas Dukcapil + Pelapor**, bukan Lurah. Lihat §7.

### Daftar 13 SOP di `SK SOP kalurahan sidoharjo.pdf`

Pengantar Nikah & Duplikat Nikah · Pengantar Dispensasi Nikah · Keterangan Wali · Pengantar Permohonan Kehendak Nikah · Pengantar Keterangan Belum Pernah Menikah · Pengantar Keterangan Domisili Pendirian PAUD/Lembaga Non Formal · Pengantar Keterangan Tidak Mampu · Pengantar BPJS Pemerintah · Pengantar Kehilangan · Pengantar Akta Kematian · Pengantar Akta Kelahiran · Izin Penelitian · Surat Pengantar Izin Keramaian

Perhatikan: **usaha dan pindah tidak ada SOP-nya.** Konfirmasi ke kalurahan sebelum menayangkan dua jenis itu di web.

---

## 1. KLH — Surat Keterangan Kelahiran

**Verdict: skema Anda cocok tapi kurang ~10 field resmi.**

Template acuan: F-2.01 (bagian `DATA ANAK`) + `f1.01 kelahiran.xlsx` (form lokal).

| Field resmi di template | Ada di skema Anda? | Catatan |
|---|---|---|
| Jenis Pelaporan (centang "Kelahiran") | — | konstanta, bukan input |
| `laporanKelahiran` umum/terlambat | ✅ | ada di form lokal |
| Pelapor: Nama, NIK | ✅ `dataPelapor` | |
| Pelapor: **Nomor KK** | ❌ | F-2.01 `DATA PELAPORAN` wajib |
| Pelapor: **Kewarganegaraan** | ❌ | default `wni` |
| Pelapor: **umur** | ❌ | form lokal minta umur, bukan tgl lahir |
| Ayah/Ibu: Nama, NIK | ✅ `dataOrangTua` | |
| Ayah/Ibu: **Tempat Lahir, Tanggal Lahir** | ❌ | F-2.01 minta eksplisit |
| Ayah/Ibu: **Kewarganegaraan** | ❌ | |
| Ayah/Ibu: **umur** | ❌ | form lokal |
| Ayah/Ibu: Pekerjaan, Alamat | ✅ | |
| `tanggalPerkawinan` ortu | ✅ (opsional) | form lokal: "Kawin Syah di KUA/Gereja/Pure" + tanggal → butuh juga `tempatPerkawinan` enum `kua`/`gereja`/`pure` |
| Anak: Nama | ✅ `namaAnak` | |
| Anak: **NIK** | ❌ | form lokal ada kolomnya (opsional, sering kosong) |
| Anak: Jenis Kelamin | ✅ | |
| Anak: **Tempat Dilahirkan** (RS/Bidan, Puskesmas, Polindes, Rumah, Lainnya) | ❌ | **Anda hanya menaruh ini di LHM. F-2.01 butuh di kelahiran juga (item 3).** |
| Anak: Tempat Kelahiran | ✅ `tempatLahir` | |
| Anak: **Hari Lahir** (nama hari) | ❌ | F-2.01 item 5 + form lokal. Bisa auto-derive dari `tanggalLahir` — jangan jadikan input |
| Anak: Tanggal Lahir | ✅ | |
| Anak: Pukul | ✅ `jamLahir` | |
| Jenis Kelahiran | ✅ | |
| Kelahiran ke | ✅ `anakKe` | |
| Penolong Kelahiran | ✅ | |
| Berat Bayi (Kg), Panjang Bayi (Cm) | ✅ | |
| Saksi I & II: Nama, **NIK**, **No. KK**, **Kewarganegaraan** | ⚠️ | `dataSaksi` Anda = nama/umur/pekerjaan/alamat. F-2.01 minta NIK + No.KK + kewarganegaraan; form lokal minta NIK/umur/pekerjaan/alamat. **Union-kan keduanya.** |

**Patch `dataSaksi` di `shared.schema.ts`:**

| Field | Tipe | Wajib |
|---|---|---|
| `nama` | string | ✅ |
| `nik` | string(16) | ✅ |
| `noKK` | string(16) | opsional |
| `kewarganegaraan` | enum `wni` \| `wna` (default `wni`) | ✅ |
| `umur` | number int | ✅ |
| `pekerjaan` | string | ✅ |
| `alamat` | string | ✅ |

**Patch `dataOrangTua`:** tambah `tempatLahirAyah`, `tanggalLahirAyah`, `kewarganegaraanAyah`, `umurAyah`, dan kembarannya untuk ibu, plus `tempatPerkawinan`.

**Patch `dataPelapor`:** tambah `noKKPelapor`, `kewarganegaraanPelapor`, `umurPelapor`.

---

## 2. LHM — Surat Keterangan Lahir Mati

**Verdict: skema Anda hampir 1:1 dengan blok `YANG LAHIR MATI` di F-2.01. Kurang 2 hal.**

| Field resmi (F-2.01 item 1–10) | Ada? |
|---|---|
| Lamanya dalam Kandungan (bulan) | ✅ |
| Jenis Kelamin | ✅ |
| Tanggal lahir mati | ✅ |
| Jenis Kelahiran | ✅ |
| Anak ke | ✅ |
| Tempat Dilahirkan | ✅ |
| Penolong kelahiran | ✅ |
| Sebab lahir mati | ✅ |
| Yang menentukan | ✅ |
| **Tempat Kelahiran** (item 10, teks bebas) | ❌ **kurang** → tambah `tempatKelahiran: string` |
| Data Saksi I & II | ❌ **kurang** → F-2.01 `DATA SAKSI` berlaku untuk semua pelaporan, termasuk lahir mati |
| Data Pelapor + Ortu | ✅ | + patch §1 |

Enum Anda sudah persis sama dengan opsi resmi. Satu catatan penulisan: di form tertulis **"Polides"** (bukan "Polindes") — pakai value `polindes` di kode, tapi render label sesuai form.

---

## 3. KTN — Surat Keterangan Kematian

**Verdict: blok `KEMATIAN` F-2.01 cocok 100%. Tapi form lokal `KEMATIAN.xlsx` minta jauh lebih banyak.**

Blok F-2.01 `KEMATIAN` (item 1–7) — semua sudah ada di skema Anda: NIK, Nama Lengkap, Tanggal Kematian, Pukul, Sebab Kematian, Tempat Kematian, Yang Menerangkan. ✅

Enum `sebabKematian` — label resmi item 5 adalah **"Sakit Biasa/Tua"**, jadi value `sakit-tua` Anda oke, tapi labelnya jangan ditulis "Sakit Tua" saja.

**Yang kurang (dari `KEMATIAN.xlsx`, form yang benar-benar dipakai kalurahan):**

| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| `noKKPelapor` | string(16) | ✅ | `DATA PELAPORAN` F-2.01 |
| `noHPPelapor` | string | opsional | ada di form lokal |
| `umurPelapor` | number | ✅ | |
| `tempatLahirAlmarhum` | string | ✅ | |
| `tanggalLahirAlmarhum` | date | ✅ | |
| `umurAlmarhum` | number | ✅ | |
| `jenisKelaminAlmarhum` | enum `laki-laki`\|`perempuan` | ✅ | |
| `anakKeAlmarhum` | number | opsional | |
| `alamatTerakhirAlmarhum` | string | ✅ | |
| `hariKematian` | derive dari `tanggalKematian` | — | jangan input manual |
| `dataOrangTua` (almarhum) | namaAyah, nikAyah, alamatAyah, umurAyah, namaIbu, nikIbu, alamatIbu, umurIbu | ✅ | F-2.01 `DATA ORANG TUA **` berlaku untuk kematian |
| `saksi[2]` | `dataSaksi` | ✅ | **skema KTN Anda sama sekali belum punya saksi — form lokal wajib 2 saksi bertanda tangan** |

---

## 4. SKU — Surat Keterangan Usaha

Template: `surat_ket_domisili_usaha_...rtf.doc`. Struktur asli, nomor 1–10 lalu 1–3:

| No | Label di template | Field Anda | Status |
|---|---|---|---|
| 1 | Nama | `nama` | ✅ |
| 2 | KTP | `nik` | ✅ (label template "KTP", isinya NIK 16 digit) |
| 3 | KK | — | ❌ **kurang** → `noKK: string(16)` |
| 4 | Tempat/tanggal lahir | `tempatLahir` + `tanggalLahir` | ✅ |
| 5 | Jenis Kelamin | `jenisKelamin` | ✅ |
| 6 | Setatus Perkawinan *(sic)* | `statusPerkawinan` | ✅ |
| 7 | Pekerjaan | `pekerjaan` | ✅ |
| 8 | Pendidikan Terakhir | — | ❌ **kurang** → `pendidikanTerakhir`, enum sama persis dengan SKTM |
| 9 | Agama | `agama` | ✅ |
| 10 | Alamat | `alamat` | ✅ |
| 1 | Bidang Usaha | `bidangUsaha` | ✅ |
| 2 | **Jenis Usaha** | — | ❌ **kurang** → `jenisUsaha: string` |
| 3 | Lokasi Usaha | `lokasiUsaha` | ✅ |

Tambahan: template punya blok tanda tangan **"Pemegang Surat"** (pemohon ikut TTD) di sebelah kiri, dan pejabat penanda tangan di contoh ini **Ulu'Ulu (SULASTANA)**, bukan Lurah.

---

## 5. SKTM — Surat Keterangan Tidak Mampu

**Verdict: skema Anda superset. Template kalurahan justru jauh lebih ramping — TAPI SKTM di sini adalah paket 4 dokumen.**

`bpjs 2024 pengantar KIS PBI.docx` berisi berurutan:

1. **REKOMENDASI KEPESERTAAN** — TTD ganda: Lurah + Ketua TKPK Kalurahan, mengetahui TKPK Kapanewon. Ada tabel anggota keluarga (No, Nama, NIK, Hubungan Keluarga, Ket).
2. **SURAT PERNYATAAN MISKIN** — bermeterai 10.000, ada `penghasilanPerBulan` (Rp) + sumpah agama.
3. **SURAT KETERANGAN TIDAK MAMPU** — inti SKTM.
4. **SKRINNING KELAYAKAN PERMOHONAN KIS BPJS** — 19 indikator berskor, diisi petugas + TTD Dukuh.

### Field di badan SKTM yang sesungguhnya (dokumen 3)

Nama · NIK · Tempat Tgl. Lahir · Agama · Status Perkawinan · Pekerjaan · Alamat lengkap. **Itu saja.**

| Field di skema Anda | Ada di template? |
|---|---|
| `namaPemohon`, `ktpPemohon`, `tempatLahirPemohon`, `tanggalLahirPemohon`, `statusPerkawinanPemohon`, `pekerjaanPemohon`, `agamaPemohon`, `alamatPemohon` | ✅ |
| `kkPemohon` | ❌ tidak ada di badan SKTM — tapi ada di Rekomendasi Kepesertaan → **pertahankan** |
| `jenisKelaminPemohon` | ❌ tidak ada di badan SKTM — ada di Rekomendasi Kepesertaan → pertahankan |
| `pendidikanTerakhirPemohon` | ❌ tidak ada di kedua dokumen → **jadikan opsional** |
| Blok anak (`namaAnak`, `nikAnak`, `namaSekolah`, `fakultasProdi`, `kelasSemester`, dst.) | ❌ **tidak ada sama sekali di template kalurahan** |

**Rekomendasi:** SKTM di Sidoharjo dipakai untuk KIS/BPJS PBI, bukan beasiswa. Jadikan **seluruh blok anak opsional** (`.optional()`), dan tambahkan blok yang benar-benar dipakai:

| Field | Tipe | Wajib |
|---|---|---|
| `keperluan` | enum `kis-bpjs-pbi` \| `beasiswa` \| `lainnya` | ✅ |
| `penghasilanPerBulan` | number | ✅ jika `keperluan = kis-bpjs-pbi` |
| `anggotaKeluarga[]` | `{ nama, nik, hubunganKeluarga, keterangan? }` | opsional |

`alamatPemohon` sebaiknya dipecah jadi `{ padukuhan, rt, rw }` seperti jenis surat lain — template menulis `PULEKULON RT.03 / RW.11, Kalurahan Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul`, formatnya identik dengan yang lain.

---

## 6. SIU — Surat Izin Usaha (BELUM ADA TEMPLATE)

**Tidak ada file "izin usaha" di zip, dan tidak ada SOP-nya di SK SOP.** Kalurahan bukan penerbit izin usaha — NIB/izin usaha keluar dari OSS. Satu-satunya artefak usaha yang nyata adalah Surat Keterangan Usaha (§4).

**Rekomendasi utama: hapus SIU, atau jadikan alias ke SKU.** Kalau tetap perlu entri terpisah (misalnya untuk "Surat Keterangan Domisili Usaha" — sesuai *nama file*-nya, meski *judul di dalamnya* SKU), pakai skema di bawah. Ini **turunan dari template SKU + field domisili usaha yang lazim**, jadi **wajib diverifikasi ke kalurahan** sebelum dipakai.

### `lib/validations/izin-usaha.schema.ts` (usulan — belum terverifikasi)

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `nama` | string | | ✅ |
| `nik` | string, 16 digit angka | | ✅ |
| `noKK` | string, 16 digit angka | | ✅ |
| `tempatLahir` | string | | ✅ |
| `tanggalLahir` | date | | ✅ |
| `jenisKelamin` | enum | `laki-laki` \| `perempuan` | ✅ |
| `statusPerkawinan` | enum | shared | ✅ |
| `pekerjaan` | string | | ✅ |
| `pendidikanTerakhir` | enum | `tidak-sekolah` \| `sd` \| `smp` \| `sma` \| `d3` \| `s1` \| `s2` \| `s3` | ✅ |
| `agama` | enum | shared | ✅ |
| `alamat` | object | `{ padukuhan, rt, rw }` shared | ✅ |
| `namaUsaha` | string | | ✅ |
| `bidangUsaha` | string | | ✅ |
| `jenisUsaha` | string | | ✅ |
| `lokasiUsaha` | string | | ✅ |
| `statusTempatUsaha` | enum | `milik-sendiri` \| `sewa` \| `pinjam-pakai` | ✅ *(usulan)* |
| `tanggalMulaiUsaha` | date | | opsional *(usulan)* |
| `jumlahKaryawan` | number int ≥ 0 | | opsional *(usulan)* |
| `keperluan` | enum | `pengajuan-kredit` \| `nib-oss` \| `bantuan-umkm` \| `lainnya` | ✅ *(usulan)* |
| `keperluanLainnya` | string | | wajib jika `keperluan = lainnya` |

Field bertanda *(usulan)* tidak ada di template mana pun — tandai jelas di PR biar tidak dikira resmi.

---

## 7. SKPD — Surat Keterangan Pindah Domisili

Sumber: `F1.03 PINDAH.xlsx` (F-1.03). **Catatan penting: ini formulir Dukcapil, bukan surat kalurahan.** Penandatangannya *Kepala Dinas Kependudukan dan Pencatatan Sipil Kabupaten Gunungkidul* + *Pelapor* — Lurah tidak tanda tangan di form ini. Jadi output web Anda untuk SKPD sebaiknya **F-1.03 terisi yang tinggal dicetak dan dibawa warga**, bukan surat berkop kalurahan.

### `lib/validations/pindah-domisili.schema.ts`

| No di form | Field | Tipe | Enum | Wajib |
|---|---|---|---|---|
| 1 | `noKK` | string, 16 digit | | ✅ |
| 2 | `namaPemohon` | string | | ✅ |
| 3 | `nikPemohon` | string, 16 digit | | ✅ |
| 4 | `jenisPermohonan` | enum | `surat-keterangan-pindah` \| `surat-keterangan-pindah-luar-negeri` \| `surat-keterangan-tempat-tinggal` \| `orang-asing-tinggal-terbatas` | ✅ |
| 5 | `alamatAsal` | object | `{ padukuhan, rt, rw }` shared | ✅ |
| 5 | `kodePosAsal` | string(5), default `"55881"` | | ✅ |
| 5 | `klasifikasiPindah` | enum | `dalam-satu-kalurahan` \| `antar-kalurahan-satu-kapanewon` \| `antar-kapanewon-satu-kabupaten` \| `antar-kabupaten-satu-provinsi` \| `antar-provinsi` | ✅ |
| 6 | `alamatTujuan` | object | `{ alamat, rt, rw, kalurahan, kapanewon, kabupaten, provinsi, kodePos }` — semua string bebas | ✅ |
| 7 | `alasanPindah` | enum | `pekerjaan` \| `pendidikan` \| `keamanan` \| `kesehatan` \| `perumahan` \| `keluarga` \| `lainnya` | ✅ |
| 7 | `alasanPindahLainnya` | string | | wajib jika `alasanPindah = lainnya` |
| 7 | `keteranganPekerjaan` | string | | opsional (form punya isian bebas di samping "Pekerjaan") |
| 8 | `jenisKepindahan` | enum | `kepala-keluarga` \| `kepala-keluarga-dan-sebagian-anggota` \| `kepala-keluarga-dan-seluruh-anggota` \| `anggota-keluarga` | ✅ |
| 9 | `statusKKTidakPindah` | enum | `numpang-kk` \| `membuat-kk-baru` | ✅ |
| 10 | `statusKKPindah` | enum | `numpang-kk` \| `membuat-kk-baru` | ✅ |
| 11 | `daftarAnggotaPindah` | array of `{ nik: string(16), namaLengkap: string, shdk: enum }`, min 1 | `shdk`: `kepala-keluarga` \| `suami` \| `istri` \| `anak` \| `menantu` \| `cucu` \| `orangtua` \| `mertua` \| `famili-lain` \| `pembantu` \| `lainnya` | ✅ |
| 19 | `rencanaPindahTanggal` | date | | ✅ |

**Blok orang asing (semua opsional, hanya jika `jenisPermohonan` = `surat-keterangan-tempat-tinggal` atau `orang-asing-tinggal-terbatas`):**

| No | Field | Tipe | Enum |
|---|---|---|---|
| 12 | `namaSponsor` | string | |
| 13 | `tipeSponsor` | enum | `organisasi` \| `pemerintah` \| `perorangan` \| `tanpa-sponsor` |
| 14 | `alamatSponsor` | string | |
| 15 | `nomorKitasKitap` | string | |
| 15 | `tanggalMasaBerlakuKitas` | date | |

**Blok pindah luar negeri (opsional, hanya jika `jenisPermohonan = surat-keterangan-pindah-luar-negeri`):**

| No | Field | Tipe |
|---|---|---|
| 16 | `negaraTujuan` | string |
| 16 | `kodeNegara` | string |
| 17 | `alamatTujuanLuarNegeri` | string |
| 18 | `penanggungJawab` | string |

Gunakan `z.discriminatedUnion` atau `superRefine` pada `jenisPermohonan` supaya dua blok terakhir tidak ikut divalidasi untuk permohonan biasa.

---

## 8. SKM — klarifikasi

**Jawaban: kemungkinan besar BUKAN "Surat Keterangan Mampu", dan bukan surat yang berbeda dari SKTM.**

Bukti dari zip:

- Tidak ada satu pun file bernama/berjudul "Mampu" (tanpa "Tidak").
- Daftar 13 SOP resmi kalurahan tidak memuat Surat Keterangan Mampu.
- Satu-satunya dokumen yang berpola "SK-M" adalah **"SURAT PERNYATAAN MISKIN"** di dalam `bpjs 2024 pengantar KIS PBI.docx`, yang merupakan **lampiran wajib SKTM**, bukan surat mandiri.

**Kemungkinan terkuat: SKM = Surat Keterangan Miskin, yaitu nama lain / lampiran dari SKTM.** Di banyak kalurahan istilah "Surat Keterangan Miskin" dan "Surat Keterangan Tidak Mampu" dipakai bergantian untuk surat yang sama.

**Rekomendasi:**

1. Hapus folder `skm/`, atau jadikan redirect ke `sktm`.
2. Kalau memang ingin dipisah, buat SKM sebagai **`suratPernyataanMiskin`** — dokumen turunan SKTM yang di-generate bersamaan, bukan jenis pengajuan tersendiri. Field-nya minimal dan semuanya sudah ada di SKTM:

| Field | Tipe | Wajib | Sumber |
|---|---|---|---|
| `namaPemohon` | string | ✅ | sama dgn SKTM |
| `tempatLahirPemohon` / `tanggalLahirPemohon` | string / date | ✅ | sama dgn SKTM |
| `alamatPemohon` | `{ padukuhan, rt, rw }` | ✅ | sama dgn SKTM |
| `pekerjaanPemohon` | string | ✅ | sama dgn SKTM |
| `penghasilanPerBulan` | number (Rp) | ✅ | **hanya ada di dokumen ini** |
| `sumpahAgama` | enum `islam` \| `kristen` \| `katholik` \| `hindu` \| `buddha` \| `konghucu` | ✅ | teks sumpah beda per agama; template hanya menyediakan versi Islam |

3. Konfirmasi ke Bu Lurah / Carik sebelum kunci keputusan — kalau ternyata yang dimaksud betul-betul "Mampu" (misal untuk syarat sekolah swasta), templatenya tidak ada di zip dan harus diminta terpisah.

---

## 9. Teks FIXED vs VARIABEL untuk template `.docx`

### 9.1 Kop surat — FIXED, tapi ada 2 varian

**Varian A** (dipakai di: pengantar kelahiran, pengantar kematian, dispensasi nikah, rekomendasi nikah, SKTM):

```
KABUPATEN GUNUNGKIDUL
KAPANEWON TEPUS
PEMERINTAH KALURAHAN SIDOHARJO
Bintaos, Sidoharjo, Tepus, Gunungkidul   Kode Pos 55881
Email : sidoharjotepus.1949@gmail.com  Website: desasidoharjo.gunungkidulkab.go.id
```

**Varian B** (dipakai di: Surat Keterangan Usaha, Rekomendasi Kepesertaan) — sama isi, beda label:

```
Posel : Sidoharjotepus.1949@gmail.com    Laman : www.desasidoharjo.gunungkidulkab.go.id
```

→ Buat **satu partial kop** dan jadikan label email/website sebagai konstanta per jenis surat. Jangan hardcode dua template terpisah.

### 9.2 Format nomor surat — semi-fixed

| Pola | Dipakai di |
|---|---|
| `100.3.5.7/{nomorUrut}/{bulanRomawi}/{tahun}` | pengantar kelahiran, pengantar kematian, dispensasi nikah |
| `100.3.5.7/{nomorUrut}/Reg/{bulanRomawi}/{tahun}` | rekomendasi nikah |
| `{nomorUrut}/Reg/{bulanRomawi}/{tahun}` | SKTM, Rekomendasi Kepesertaan, Surat Keterangan Usaha |

Bulan wajib angka Romawi. Sediakan helper `toRomanMonth(date)`.

### 9.3 Kalimat pembuka — FIXED per jenis surat

| Jenis | Kalimat baku (verbatim) |
|---|---|
| Pengantar kelahiran/kematian | `Yang bertandatangan di bawah ini Kami Lurah Kalurahan Sidoharjo Kapanewon Tepus Kabupaten Gunungkidul menerangkan bahwa orang tersebut di bawah ini :` |
| SKTM | `Yang bertandatangan di bawah ini kami Lurah Kalurahan Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul menerangkan bahwa orang tersebut dibawah ini :` |
| Surat Keterangan Usaha | `Yang bertanda tangan di bawah ini, Lurah Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul, menerangkan dengan sebenarnya bahwa :` |
| Rekomendasi Kepesertaan | `Yang bertanda tangan dibawah ini, Lurah Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul. Menerangkan dengan sesungguhnya bahwa :` |
| Rekomendasi nikah | `Yang bertanda tangan dibawah ini Lurah Sidoharjo Kapanewon Tepus Kabupaten Gunungkidul menerangkan bahwa seorang :` |
| Dispensasi nikah | `Yang bertanda tangan dibawah ini kami Lurah Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul menerangkan bahwa mempelai dibawah ini:` |

Perhatikan variasi spasi/koma antar surat itu **memang begitu di aslinya**. Simpan verbatim; jangan "dirapikan", nanti petugas merasa suratnya berubah.

### 9.4 Kalimat penutup — FIXED

| Jenis | Kalimat |
|---|---|
| Pengantar kelahiran/kematian | `Demikian surat keterangan ini dibuat sesuai data yang sebenarnya agar dapat dipergunakan sebagaimana mestinya.` |
| SKTM | `Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.` |
| Surat Keterangan Usaha | `Demikian Surat Keterangan ini kami buat dengan keadaan yang sebenarnya agar dapat dipergunakan dengan sebagaimana mestinya.` |
| Rekomendasi Kepesertaan | `Demikian surat rekomendasi ini dibuat untuk digunakan sebagaimana mestinya.` |
| Rekomendasi nikah | `Demikian surat permohonan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagai mana mestinya` |

Khusus SKTM ada satu kalimat inti yang **wajib verbatim** karena ini yang bikin surat sah:

```
Orang tersebut diatas adalah benar-benar warga Kalurahan Sidoharjo, Kapanewon Tepus,
Kabupaten Gunungkidul, sesuai pengamatan kami warga tersebut keadaan perekonomiannya
KURANG MAMPU, dan termasuk dalam kriteria KELUARGA MISKIN.
```

### 9.5 Blok tanda tangan — VARIABEL, dan ini yang paling sering salah

Penanda tangan **berbeda per jenis surat**. Jangan hardcode "Lurah".

| Surat | a.n. | Jabatan | Nama (per contoh di zip) |
|---|---|---|---|
| Pengantar kelahiran | `Ub. Lurah,` | Jagabaya | EKA SULISTYANA |
| Pengantar kematian | `u.b. Lurah,` | Jagabaya | EKA SULISTYANA |
| SKTM | `A.n. Lurah,` | CARIK | HERU EKO SUSILO |
| Surat Keterangan Usaha | — | Ulu'Ulu, | SULASTANA |
| Dispensasi nikah | — | Lurah Sidoharjo, | EVI NURCAHYANI, SIP |
| Rekomendasi nikah | — | Lurah Sidoharjo, | EVI NURCAHYANI, SIP |
| Rekomendasi Kepesertaan | — | Lurah + Ketua TKPK Kalurahan (2 TTD) + mengetahui TKPK Kapanewon | EVI NURCAHYANI, SIP / HERU EKO SUSILO |

**Buat tabel `pejabat` di Supabase** (`nama`, `jabatan`, `nip`, `aktif`) dan simpan `atasNama` (`ub`/`an`/`null`) di config per jenis surat. Petugas pilih penanda tangan saat approve — jangan taruh nama pejabat di dalam `.docx`.

### 9.6 Placeholder yang sudah dipakai kalurahan

Beberapa file mengandung token yang belum ter-render: `[nip_pamong]`, `[px_nama]`, `[px_nik]`, `[px_hubungan]`. Artinya kalurahan sudah pernah pakai sistem berbasis template (bergaya OpenSID). Dua implikasi:

1. Sediakan `nipPejabat` — kalau kosong, baris NIP harus **hilang**, bukan tercetak kosong. Di docxtemplater pakai `{#nipPejabat}NIP. {nipPejabat}{/nipPejabat}`.
2. Kalau nanti mau migrasi/diserahkan ke kalurahan, pertimbangkan menyamakan penamaan placeholder dengan gaya mereka biar tidak asing.

### 9.7 Ringkasan placeholder minimum tiap `.docx`

**Global (semua surat):**

```
{nomorUrut} {bulanRomawi} {tahun} {tanggalSuratPanjang}
{namaPejabat} {jabatanPejabat} {atasNamaPejabat} {nipPejabat}
```

`{tanggalSuratPanjang}` = `Sidoharjo, 20 Agustus 2026` (format `d MMMM yyyy`, locale `id-ID`).

**Per surat:** semua field dari skema Zod masing-masing, camelCase persis sama, sehingga `docxtemplater.render(pengajuan.data)` bisa langsung jalan tanpa mapping layer.

**Untuk enum:** jangan kirim value kebab-case ke docx. Bikin `lib/labels.ts` berisi `enumLabels[field][value]` → `"belum-kawin"` jadi `"BELUM KAWIN"`. Template resmi menulis nilai dalam **HURUF KAPITAL** (`LAKI-LAKI`, `ISLAM`, `KAWIN`, `PETANI/PEKEBUN`), jadi konsisten uppercase saja untuk semua nilai data.

**Untuk alamat:** format baku yang muncul di semua surat adalah

```
{PADUKUHAN} RT.{rt} / RW.{rw}, Kalurahan Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul
```

Bikin satu helper `formatAlamat(alamat)`. Catatan: di F-1.03 RT/RW ditulis 3 digit (`001`, `007`, `011`), di surat lain 2 digit (`02`, `03`). **Simpan sebagai string, jangan number** — leading zero penting dan RW di Sidoharjo sudah sampai `011`.

---

## 10. Daftar aksi

| # | Aksi | Prioritas |
|---|---|---|
| 1 | Patch `shared.schema.ts`: `dataSaksi` (+nik, +noKK, +kewarganegaraan), `dataOrangTua` (+tempat/tanggal lahir, +kewarganegaraan, +umur), `dataPelapor` (+noKK, +kewarganegaraan, +umur) | tinggi |
| 2 | KTN: tambah blok saksi (2) + data ortu almarhum + biodata almarhum | tinggi |
| 3 | KLH: tambah `tempatDilahirkan`, `noKKPelapor`, `nikAnak` | tinggi |
| 4 | LHM: tambah `tempatKelahiran` + saksi | sedang |
| 5 | SKU: tambah `noKK`, `pendidikanTerakhir`, `jenisUsaha` | sedang |
| 6 | SKTM: blok anak → opsional; tambah `keperluan`, `penghasilanPerBulan`, `anggotaKeluarga[]`; pecah `alamatPemohon` | sedang |
| 7 | Buat `pindah-domisili.schema.ts` dari §7 | sedang |
| 8 | **Tanya kalurahan**: apakah SIU = SKU? apakah SKM = SKTM? adakah template pindah versi kalurahan? | **blocker** |
| 9 | Buat tabel `pejabat` + config penanda tangan per jenis surat | tinggi |
| 10 | Helper: `toRomanMonth`, `formatAlamat`, `formatTanggalPanjang`, `enumLabels` | tinggi |

---

## 11. Jenis surat yang belum ada di aplikasi tapi ada templatenya

Kalau mau menambah cakupan, empat ini sudah punya template lengkap + SOP:

| Kode usulan | Surat | Template |
|---|---|---|
| `RKN` | Surat Pengantar Mohon Rekomendasi Nikah | `rekomendasi nikah.docx` |
| `DPN` | Permohonan Dispensasi Nikah (→ Panewu) | `dispensasi nikah.docx` |
| `N1` | Pengantar Nikah Model N1 (pria & wanita) | `surat_pengantar_nikah_*.rtf.doc` |
| `KIS` | Rekomendasi Kepesertaan KIS/BPJS PBI | `bpjs 2024 pengantar KIS PBI.docx` |

`N1` formatnya diatur Kepdirjen Bimas Islam No. 473/2020 — layoutnya tidak boleh diubah sama sekali.
