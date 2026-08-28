# PROMPT UNTUK CLAUDE CODE — Tambah 3 Formulir Dukcapil

> Salin seluruh isi file ini ke Claude Code.

---

## Konteks

Proyek aplikasi pengajuan surat online Kalurahan Sidoharjo, Kapanewon Tepus,
Kabupaten Gunungkidul. Stack: Next.js (App Router) + TypeScript + Tailwind +
shadcn/ui + React Hook Form + Zod + Supabase.

Alur: warga isi form tanpa login → data disimpan sebagai JSON di kolom `data`
(jsonb) tabel `pengajuan` → dapat nomor tiket → petugas login, lihat dashboard,
ubah status.

Sudah ada: KLH, LHM, KTN, SKU, SKTM, SKPD, RKN, DPN, PN.

Tugas kamu: menambahkan **3 formulir Dukcapil** — BDK, PPK, dan PED.

### Perbedaan penting dari surat-surat sebelumnya

Ketiganya **bukan surat kalurahan**. Tidak berkop kalurahan, dan Lurah tidak
menandatanganinya. Sama seperti SKPD yang sudah ada, hasilnya adalah formulir
resmi Dukcapil yang tinggal dicetak dan dibawa warga.

| Kode | Formulir | Ditandatangani oleh |
|---|---|---|
| BDK | F-1.01 Formulir Biodata Keluarga | Kepala Dinas Dukcapil Kabupaten Gunungkidul + Kepala Keluarga |
| PPK | F-1.02 Formulir Pendaftaran Peristiwa Kependudukan | Petugas Dukcapil + Pemohon |
| PED | F-1.06 Surat Pernyataan Perubahan Elemen Data | **Warga sendiri saja** — tidak ada tanda tangan pejabat |

Jangan menaruh nama atau jabatan Lurah di mana pun pada ketiganya.

---

## Konvensi yang WAJIB diikuti

1. Penamaan field **camelCase**.
2. Field pilihan tetap memakai **enum value kebab-case** (`"belum-kawin"`, bukan `"Belum Kawin"`).
3. Satu jenis = satu file `lib/validations/<slug>.schema.ts`.
4. Pakai ulang yang sudah ada di `lib/validations/shared.schema.ts`, jangan diduplikasi:
   `nik`, `jenisKelamin`, `agama`, `statusPerkawinan`, `alamat` (objek
   `{ padukuhan, rt, rw }` dengan dropdown 10 padukuhan), `kewarganegaraan`,
   `pendidikanTerakhir`, dan enum `shdk` yang sudah dibuat untuk SKPD.
5. `rt`, `rw`, dan semua kode pos disimpan sebagai **string**, bukan number.
6. Jangan menambah field di luar daftar di bawah. Field bertanda
   `[TIDAK ADA DI TEMPLATE]` adalah usulan — buat, tapi jadikan opsional dan
   beri komentar.

### Enum baru yang perlu ditambahkan ke `shared.schema.ts`

| Nama | Value |
|---|---|
| `golonganDarah` | `a` \| `b` \| `ab` \| `o` \| `a-plus` \| `a-minus` \| `b-plus` \| `b-minus` \| `ab-plus` \| `ab-minus` \| `o-plus` \| `o-minus` \| `tidak-tahu` |
| `tipeSponsor` | sudah ada dari SKPD — pakai ulang |

---

## FORMULIR 1 — Kode `PED` (kerjakan pertama, paling sederhana)

**Nama lengkap:** Surat Pernyataan Perubahan Elemen Data Kependudukan (F-1.06)
**File skema:** `lib/validations/perubahan-elemen-data.schema.ts`
**Sumber:** `F.106 PERUBAHAN.rtf.doc`
**Deskripsi kartu:** "Pernyataan perubahan data kependudukan seperti pendidikan,
pekerjaan, atau agama pada KK."
**Estimasi proses:** 1 hari kerja

### Blok 1 — identitas yang menyatakan

| Field | Tipe | Wajib |
|---|---|---|
| `namaLengkap` | string | ✅ |
| `nik` | string 16 digit | ✅ |
| `nomorKK` | string 16 digit | ✅ |
| `alamatRumah` | object shared `alamat` | ✅ |

### Blok 2 — rincian anggota KK

`anggotaKeluarga`: array, minimal 1, maksimal 10. Tiap item:

| Field | Tipe | Wajib |
|---|---|---|
| `nama` | string | ✅ |
| `nik` | string 16 digit | ✅ |
| `shdk` | enum shared `shdk` | ✅ |
| `keterangan` | string | opsional |

### Blok 3 — perubahan pendidikan dan pekerjaan (bagian A)

`perubahanPendidikanPekerjaan`: array, maksimal 7, boleh kosong. Tiap item:

| Field | Tipe | Wajib |
|---|---|---|
| `nomorAnggota` | number int | ✅ — merujuk nomor urut di `anggotaKeluarga` |
| `pendidikanSemula` | enum shared `pendidikanTerakhir` | opsional |
| `pendidikanMenjadi` | enum shared `pendidikanTerakhir` | opsional |
| `dasarPerubahanPendidikan` | string | opsional |
| `pekerjaanSemula` | string | opsional |
| `pekerjaanMenjadi` | string | opsional |
| `dasarPerubahanPekerjaan` | string | opsional |
| `keterangan` | string | opsional |

### Blok 4 — perubahan agama dan lainnya (bagian B)

`perubahanAgamaLainnya`: array, maksimal 7, boleh kosong. Tiap item:

| Field | Tipe | Wajib |
|---|---|---|
| `nomorAnggota` | number int | ✅ |
| `agamaSemula` | enum shared `agama` | opsional |
| `agamaMenjadi` | enum shared `agama` | opsional |
| `dasarPerubahanAgama` | string | opsional |
| `namaElemenLainnya` | string | opsional — isian "Lainnya, yaitu ..." |
| `lainnyaSemula` | string | opsional |
| `lainnyaMenjadi` | string | opsional |
| `dasarPerubahanLainnya` | string | opsional |
| `keterangan` | string | opsional |

### Validasi silang

- Minimal salah satu dari `perubahanPendidikanPekerjaan` atau
  `perubahanAgamaLainnya` harus punya isi. Kalau keduanya kosong, tolak dengan
  pesan "Isi minimal satu perubahan data."
- Setiap `nomorAnggota` harus ada di dalam `anggotaKeluarga`.
- Pada tiap baris perubahan, kalau `pendidikanSemula` diisi maka
  `pendidikanMenjadi` wajib diisi, dan sebaliknya. Berlaku sama untuk pasangan
  pekerjaan, agama, dan lainnya. Pakai `superRefine`.

### Catatan

Bagian catatan kaki di template menyebut bahwa perubahan "Lainnya" juga dipakai
untuk memperbaiki kesalahan pengisian atau kesalahan entri data oleh petugas.
Tampilkan keterangan ini sebagai teks bantuan di form, jangan jadikan field.

---

## FORMULIR 2 — Kode `PPK`

**Nama lengkap:** Formulir Pendaftaran Peristiwa Kependudukan (F-1.02)
**File skema:** `lib/validations/peristiwa-kependudukan.schema.ts`
**Sumber:** `F-1.02-1.pdf`
**Deskripsi kartu:** "Formulir pendaftaran untuk pembuatan atau perubahan KK,
KTP-el, dan Kartu Identitas Anak."
**Estimasi proses:** 1 hari kerja

### Blok 1 — data pemohon

| Field | Tipe | Wajib |
|---|---|---|
| `namaLengkap` | string | ✅ |
| `nik` | string 16 digit | ✅ |
| `nomorKK` | string 16 digit | ✅ |

### Blok 2 — jenis permohonan

Formulir aslinya berupa matriks 4 kolom. Modelkan sebagai **dua field bertingkat**:

| Field | Tipe | Enum |
|---|---|---|
| `kategoriPermohonan` | enum | `kartu-keluarga` \| `ktp-el` \| `kartu-identitas-anak` \| `perubahan-data` |
| `jenisPermohonan` | enum | tergantung kategori — lihat matriks di bawah |

**Matriks kombinasi yang sah** (validasi dengan `superRefine`, tolak kombinasi di luar ini):

| `kategoriPermohonan` | `jenisPermohonan` yang diizinkan |
|---|---|
| `kartu-keluarga` | `baru-membentuk-keluarga-baru`, `baru-penggantian-kepala-keluarga`, `baru-pisah-kk`, `baru-pindah-datang`, `baru-wni-dari-luar-negeri-karena-pindah`, `baru-rentan-adminduk`, `perubahan-menumpang-dalam-kk`, `perubahan-peristiwa-penting`, `perubahan-elemen-data-dalam-kk`, `hilang`, `rusak` |
| `ktp-el` | `baru`, `pindah-datang`, `hilang`, `rusak`, `perpanjangan-itap`, `perubahan-status-kewarganegaraan`, `luar-domisili`, `transmigrasi` |
| `kartu-identitas-anak` | `baru`, `hilang`, `rusak`, `perpanjangan-itap`, `lainnya` |
| `perubahan-data` | `kk`, `ktp-el`, `kia` |

Untuk kategori `perubahan-data`, formulir asli mencantumkan catatan bahwa pemohon
melampirkan Formulir Perubahan Data dan Bukti Perubahan Data. Tampilkan sebagai
teks bantuan, jangan jadikan field.

### Blok 3 — persyaratan yang dilampirkan

`persyaratanDilampirkan`: array of enum, minimal 1 item. Ini 16 kotak centang di
formulir asli, urutannya jangan diubah:

```
kk-lama-atau-rusak
buku-nikah-atau-kutipan-akta-perkawinan
kutipan-akta-perceraian
surat-keterangan-pindah
surat-keterangan-pindah-luar-negeri
ktp-el-rusak
dokumen-perjalanan
surat-keterangan-hilang-dari-kepolisian
surat-keterangan-bukti-perubahan-peristiwa-kependudukan
sptjm-perkawinan-atau-perceraian-belum-tercatat
akta-kematian
surat-pernyataan-penyebab-hilang-atau-rusak
surat-keterangan-pindah-dari-perwakilan-ri
surat-pernyataan-bersedia-menerima-sebagai-anggota-keluarga
surat-kuasa-pengasuhan-anak-dari-orang-tua-atau-wali
kartu-izin-tinggal-tetap
```

Tampilkan sebagai daftar checkbox dua kolom, sama seperti tata letak formulir asli.

---

## FORMULIR 3 — Kode `BDK` (kerjakan terakhir, paling besar)

**Nama lengkap:** Formulir Biodata Keluarga (F-1.01)
**File skema:** `lib/validations/biodata-keluarga.schema.ts`
**Sumber:** `FORM KK.rtf.doc`
**Deskripsi kartu:** "Pendaftaran biodata keluarga baru untuk penerbitan Kartu
Keluarga."
**Estimasi proses:** 3 hari kerja

### Yang harus dipahami dulu

Formulir ini punya **41 kolom per anggota keluarga**, untuk maksimal 10 anggota.
Tapi tidak semua kolom wajib untuk semua orang — formulir aslinya memuat catatan:

| `jenisInput` | Kolom yang diisi |
|---|---|
| `wni` | 2 s.d. 6, 10 s.d. 31, 38 s.d. 41 |
| `orang-asing` | 2 s.d. 13, 15 s.d. 41 |
| `wni-luar-negeri` | 2 s.d. 31, 38 s.d. 41 |

**Ini penting untuk UI:** jangan tampilkan 41 field ke semua orang. Setelah warga
memilih `jenisInput`, sembunyikan kolom yang tidak relevan. Untuk warga WNI biasa
(kasus terbanyak), yang tampil hanya sekitar 26 field per anggota, bukan 41.

**Tidak ada kolom NIK anggota keluarga.** Ini disengaja — NIK justru diterbitkan
Dukcapil berdasarkan formulir ini. Jangan menambahkan field NIK anggota.

### Blok 1 — jenis input

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `jenisInput` | enum | `wni` \| `orang-asing` \| `wni-luar-negeri` | ✅ |

### Blok 2 — data kepala keluarga

| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| `namaKepalaKeluarga` | string | ✅ | |
| `alamat` | object shared `alamat` | ✅ | `padukuhan` mengisi kolom "Nama Dusun/Dukuh" |
| `kodePos` | string 5 digit | ✅ | default `"55881"` |
| `jumlahAnggotaKeluarga` | number int ≥ 1, ≤ 10 | ✅ | |
| `telepon` | string | opsional | |
| `email` | string email | opsional | |

**Data wilayah (kolom 9–12) sudah tercetak tetap di formulir:** Provinsi 34
Daerah Istimewa Yogyakarta, Kabupaten 03 Gunungkidul, Kecamatan Tepus, Kelurahan
Sidoharjo. Jadikan **konstanta di kode**, bukan input warga. Kode wilayah lengkap
diisi petugas Dukcapil — jangan buat field untuk itu.

### Blok 3 — alamat di luar negeri

Hanya muncul dan hanya divalidasi kalau `jenisInput = wni-luar-negeri`. Pakai
`superRefine` atau `discriminatedUnion`.

| Field | Tipe | Wajib jika aktif |
|---|---|---|
| `alamatLuarNegeri` | string | ✅ |
| `kotaLuarNegeri` | string | ✅ |
| `provinsiNegaraBagian` | string | opsional |
| `negara` | string | ✅ |
| `kodePosLuarNegeri` | string | opsional |
| `teleponLuarNegeri` | string | opsional |
| `emailLuarNegeri` | string email | opsional |

Kode negara dan kode perwakilan RI diisi petugas — jangan buat field.

### Blok 4 — data anggota keluarga

`anggotaKeluarga`: array, minimal 1, maksimal 10. Nomor dalam kurung adalah nomor
kolom di formulir asli — pertahankan sebagai komentar di kode supaya mudah
dicocokkan saat membuat template `.docx` nanti.

| Kol | Field | Tipe | Enum | Wajib untuk |
|---|---|---|---|---|
| 2 | `namaLengkap` | string | | semua |
| 3 | `gelarDepan` | string | | opsional |
| 4 | `gelarBelakang` | string | | opsional |
| 5 | `nomorPaspor` | string | | opsional |
| 6 | `tanggalBerakhirPaspor` | date | | opsional |
| 7 | `namaSponsor` | string | | orang-asing |
| 8 | `tipeSponsor` | enum | shared `tipeSponsor` | orang-asing |
| 9 | `alamatSponsor` | string | | orang-asing |
| 10 | `jenisKelamin` | enum | shared `jenisKelamin` | semua |
| 11 | `tempatLahir` | string | | semua |
| 12 | `tanggalLahir` | date | | semua |
| 13 | `kewarganegaraan` | enum | shared `kewarganegaraan` | semua |
| 14 | `nomorSKPenetapanWNI` | string | | opsional, hanya orang-asing |
| 15 | `punyaAktaLahir` | boolean | | semua |
| 16 | `nomorAktaKelahiran` | string | | wajib jika `punyaAktaLahir = true` |
| 17 | `golonganDarah` | enum | shared `golonganDarah` | opsional |
| 18 | `agama` | enum | shared `agama` | semua |
| 19 | `namaOrganisasiKepercayaan` | string | | opsional |
| 20 | `statusPerkawinan` | enum | shared `statusPerkawinan` | semua |
| 21 | `punyaAktaPerkawinan` | boolean | | semua |
| 22 | `nomorAktaPerkawinan` | string | | wajib jika `punyaAktaPerkawinan = true` |
| 23 | `tanggalPerkawinan` | date | | wajib jika `punyaAktaPerkawinan = true` |
| 24 | `punyaAktaCerai` | boolean | | semua |
| 25 | `nomorAktaPerceraian` | string | | wajib jika `punyaAktaCerai = true` |
| 26 | `tanggalPerceraian` | date | | wajib jika `punyaAktaCerai = true` |
| 27 | `shdk` | enum | shared `shdk` | semua |
| 28 | `kelainanFisikMental` | string | | opsional |
| 29 | `penyandangCacat` | string | | opsional |
| 30 | `pendidikanTerakhir` | enum | shared `pendidikanTerakhir` | semua |
| 31 | `jenisPekerjaan` | string | | semua |
| 32 | `nomorItasItap` | string | | orang-asing |
| 33 | `tempatTerbitItasItap` | string | | orang-asing |
| 34 | `tanggalTerbitItasItap` | date | | orang-asing |
| 35 | `tanggalAkhirItasItap` | date | | orang-asing |
| 36 | `tempatDatangPertama` | string | | orang-asing |
| 37 | `tanggalKedatanganPertama` | date | | orang-asing |
| 38 | `nikIbu` | string 16 digit | | semua |
| 39 | `namaIbu` | string | | semua |
| 40 | `nikAyah` | string 16 digit | | semua |
| 41 | `namaAyah` | string | | semua |

### Validasi silang BDK

- Panjang array `anggotaKeluarga` harus sama dengan `jumlahAnggotaKeluarga`.
- Tepat satu anggota harus punya `shdk = kepala-keluarga`, dan namanya harus
  sama dengan `namaKepalaKeluarga`.
- Kolom bertanda "orang-asing" hanya wajib kalau `jenisInput = orang-asing`.
  Untuk `jenisInput` lain, semua kolom itu opsional.
- Kolom 32–37 tidak diisi sama sekali kalau `jenisInput = wni`.

---

## Yang harus kamu kerjakan

1. Buat tiga file skema Zod sesuai path di atas, ikuti gaya file skema yang sudah
   ada (`sktm.schema.ts` dan `pindah-domisili.schema.ts` sebagai acuan terdekat).
2. Tambahkan enum `golonganDarah` ke `shared.schema.ts`. Jangan mengubah enum
   yang sudah ada.
3. Buat halaman formulir pengisian untuk ketiganya.
4. **Untuk BDK dan PED, wajib pakai `useFieldArray`** — keduanya punya daftar
   anggota yang jumlahnya tidak tetap, dengan tombol tambah dan hapus baris.
5. **Untuk BDK, formulirnya harus bertahap (wizard), bukan satu halaman datar.**
   Urutan langkah: Jenis Input → Data Kepala Keluarga → (Alamat Luar Negeri, kalau
   relevan) → Anggota Keluarga satu per satu → Tinjau Ulang. Tampilkan indikator
   progres. Simpan draft di state supaya warga tidak kehilangan isian saat pindah
   langkah.
6. Pada BDK, sediakan tombol **"Salin alamat & data orang tua dari anggota
   sebelumnya"** untuk mempercepat pengisian anak-anak dalam satu keluarga.
7. Sembunyikan field yang tidak relevan berdasarkan `jenisInput` di BDK dan
   berdasarkan `kategoriPermohonan` di PPK. Jangan hanya men-disable — sembunyikan.
8. Daftarkan ketiganya ke halaman "Jenis Surat yang Tersedia" dengan kode, judul,
   deskripsi, dan estimasi proses seperti di atas. Beri penanda visual bahwa
   ketiganya formulir Dukcapil, bukan surat kalurahan — samakan gayanya dengan
   kartu SKPD yang sudah ada.

## Yang JANGAN kamu kerjakan

- Jangan menyentuh skema KLH, LHM, KTN, SKU, SKTM, SKPD, RKN, DPN, atau PN.
- Jangan menaruh nama, jabatan, atau tanda tangan Lurah di ketiga formulir ini.
- Jangan membuat field untuk kode wilayah, kode negara, atau kode perwakilan RI —
  itu diisi petugas Dukcapil.
- Jangan menambahkan field NIK untuk anggota keluarga di BDK.
- Jangan mengerjakan generate `.docx` dulu. Tahap ini hanya skema + formulir.
- Jangan menambah field di luar daftar di atas.

## Catatan keamanan yang harus kamu perhatikan

Ketiga formulir ini mengumpulkan data yang jauh lebih sensitif daripada surat
sebelumnya: biodata lengkap satu keluarga, NIK orang tua, golongan darah, dan
kolom kelainan fisik/mental serta penyandang cacat. Formulir diisi tanpa login.

Karena itu:

- Pastikan RLS di tabel `pengajuan` benar-benar melarang pembacaan anonim. Nomor
  tiket hanya boleh mengembalikan **status**, jangan pernah mengembalikan isi
  kolom `data`.
- Tambahkan rate limit pada endpoint submit ketiga formulir ini.
- Jangan menuliskan isi `data` ke log aplikasi.

Kalau kamu menemukan bahwa halaman cek status saat ini mengembalikan isi
pengajuan, laporkan — jangan diam-diam diperbaiki tanpa memberi tahu.

## Setelah selesai

Laporkan dalam bentuk daftar singkat:
- file apa saja yang dibuat dan diubah,
- field mana yang kamu tandai opsional dan alasannya,
- hasil pengecekan RLS dan halaman cek status,
- bagian mana yang kamu ragu dan perlu dikonfirmasi ke pihak kelurahan.
