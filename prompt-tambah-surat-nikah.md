# PROMPT UNTUK CLAUDE CODE — Tambah 3 Jenis Surat Baru

> Salin seluruh isi file ini ke Claude Code.

---

## Konteks

Ini proyek aplikasi pengajuan surat online Kalurahan Sidoharjo, Kapanewon Tepus,
Kabupaten Gunungkidul. Stack: Next.js (App Router) + TypeScript + Tailwind +
shadcn/ui + React Hook Form + Zod + Supabase.

Alur yang sudah berjalan: warga isi form tanpa login → data disimpan sebagai JSON
di kolom `data` (jsonb) tabel `pengajuan` → dapat nomor tiket → petugas login,
lihat dashboard, ubah status (menunggu/diproses/selesai/ditolak).

Jenis surat yang **sudah ada** skema + formulirnya: KLH, LHM, KTN, SKU, SKTM, SKPD.

Tugas kamu: menambahkan **3 jenis surat baru** — RKN, DPN, dan PN — dengan
skema Zod dan formulir pengisiannya, mengikuti pola yang sudah ada.

---

## Konvensi yang WAJIB diikuti

1. Penamaan field selalu **camelCase**.
2. Field pilihan tetap memakai **enum dengan value kebab-case** (contoh:
   `"belum-kawin"`, bukan `"Belum Kawin"`).
3. Satu jenis surat = satu file di `lib/validations/<slug>.schema.ts`.
4. Field bersama diambil dari `lib/validations/shared.schema.ts`. Jangan
   menduplikasi enum yang sudah ada di sana:
   - `nik` — string 16 digit angka
   - `jenisKelamin` — `laki-laki` | `perempuan`
   - `agama` — `islam` | `kristen` | `katholik` | `hindu` | `buddha` | `konghucu`
   - `statusPerkawinan` — `belum-kawin` | `kawin` | `cerai-hidup` | `cerai-mati`
   - `alamat` — objek `{ padukuhan, rt, rw }`, `padukuhan` adalah dropdown 10
     pilihan tetap: Prigi, Bintaos, Klepu, Jati, Bengle I, Bengle II, Puleireng,
     Pule Ngelo, Pule Gundes I, Pule Kulon
5. `rt` dan `rw` disimpan sebagai **string**, bukan number — leading zero penting
   dan nomor RW di Sidoharjo sudah sampai `011`.

### Aturan penting soal alamat

Dropdown padukuhan hanya boleh dipakai untuk **warga Sidoharjo**. Ketiga surat
di bawah melibatkan calon pasangan dan orang tua yang bisa berdomisili di luar
Sidoharjo, bahkan luar Gunungkidul. Untuk pihak-pihak itu, alamat harus berupa
**string teks bebas**, bukan objek `alamat` dengan dropdown. Ini sudah ditandai
per field di tabel-tabel di bawah.

### Aturan penting soal cakupan field

Jangan menambahkan field yang tidak ada di daftar ini. Setiap field di bawah
diambil langsung dari template resmi kelurahan. Field yang ditandai
`[TIDAK ADA DI TEMPLATE]` adalah usulan tambahan — buat, tapi jadikan
**opsional** dan beri komentar `// tidak ada di template resmi, untuk verifikasi internal`.

---

## SURAT 1 — Kode `RKN`

**Nama lengkap:** Surat Pengantar Mohon Rekomendasi Nikah
**File skema:** `lib/validations/rekomendasi-nikah.schema.ts`
**Sumber:** `rekomendasi nikah.docx`
**Penanda tangan:** Lurah Sidoharjo
**Deskripsi untuk kartu di halaman Jenis Surat:** "Pengantar dari Kalurahan untuk
mengurus rekomendasi nikah."
**Estimasi proses:** 2 hari kerja

### Field

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `namaPemohon` | string | | ✅ |
| `nikPemohon` | string 16 digit | | opsional `[TIDAK ADA DI TEMPLATE]` |
| `tempatLahirPemohon` | string | | ✅ |
| `tanggalLahirPemohon` | date | | ✅ |
| `agamaPemohon` | enum | shared `agama` | ✅ |
| `pekerjaanPemohon` | string | | ✅ |
| `alamatPemohon` | object | shared `alamat` (dropdown padukuhan) | ✅ |
| `namaCalonIstri` | string | | ✅ |
| `tempatLahirCalonIstri` | string | | ✅ |
| `tanggalLahirCalonIstri` | date | | ✅ |
| `agamaCalonIstri` | enum | shared `agama` | ✅ |
| `pekerjaanCalonIstri` | string | | ✅ |
| `alamatCalonIstri` | **string teks bebas** | | ✅ |

**Catatan:** template surat ini menyebut pemohon sebagai laki-laki dan pihak kedua
sebagai perempuan secara eksplisit ("akan melangsungkan pernikahan dengan seorang
Perempuan"). Jadi tidak perlu field jenis kelamin.

---

## SURAT 2 — Kode `DPN`

**Nama lengkap:** Permohonan Dispensasi Nikah
**File skema:** `lib/validations/dispensasi-nikah.schema.ts`
**Sumber:** `dispensasi nikah.docx`
**Ditujukan kepada:** Panewu Kapanewon Tepus (bukan Dukcapil, bukan KUA)
**Penanda tangan:** Lurah Sidoharjo
**Deskripsi untuk kartu:** "Permohonan dispensasi waktu pelaksanaan nikah kepada
Panewu Kapanewon Tepus."
**Estimasi proses:** 2 hari kerja

### Field — blok mempelai (warga Sidoharjo)

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `namaMempelai` | string | | ✅ |
| `jenisKelaminMempelai` | enum | shared `jenisKelamin` | ✅ |
| `tempatLahirMempelai` | string | | ✅ |
| `tanggalLahirMempelai` | date | | ✅ |
| `kewarganegaraanMempelai` | enum | `wni` \| `wna`, default `wni` | ✅ |
| `agamaMempelai` | enum | shared `agama` | ✅ |
| `pekerjaanMempelai` | string | | ✅ |
| `statusPerkawinanMempelai` | enum | shared `statusPerkawinan` | ✅ |
| `alamatMempelai` | object | shared `alamat` (dropdown padukuhan) | ✅ |

### Field — blok calon pasangan

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `namaCalonPasangan` | string | | ✅ |
| `jenisKelaminCalonPasangan` | enum | shared `jenisKelamin` | ✅ |
| `tempatLahirCalonPasangan` | string | | ✅ |
| `tanggalLahirCalonPasangan` | date | | ✅ |
| `kewarganegaraanCalonPasangan` | enum | `wni` \| `wna`, default `wni` | ✅ |
| `agamaCalonPasangan` | enum | shared `agama` | ✅ |
| `pekerjaanCalonPasangan` | string | | ✅ |
| `statusPerkawinanCalonPasangan` | enum | shared `statusPerkawinan` | ✅ |
| `alamatCalonPasangan` | **string teks bebas** | | ✅ |

### Field — rencana pelaksanaan

| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| `tanggalAkad` | date | ✅ | nama hari JANGAN dibuat input — turunkan otomatis dari tanggal ini |
| `jamAkad` | string `HH:mm` | ✅ | |
| `tempatAkad` | string | ✅ | |

**Validasi tambahan:** `tanggalAkad` harus di masa depan (minimal hari ini).

**Catatan penting soal penamaan:** template aslinya menulis blok pertama sebagai
"mempelai" lalu blok kedua sebagai "Calon Suami" — artinya blok pertama secara
implisit adalah perempuan. Saya sengaja memakai nama netral (`Mempelai` /
`CalonPasangan`) supaya form bisa dipakai dua arah. Beri komentar di file skema
yang menjelaskan hal ini, karena template `.docx` nanti perlu penyesuaian label.

---

## SURAT 3 — Kode `PN`

**Nama lengkap:** Pengantar Nikah (paket Model N1, N2, N4)
**File skema:** `lib/validations/pengantar-nikah.schema.ts`
**Sumber:** `surat_pengantar_nikah_pria_473_....doc` dan versi wanita
**Dasar hukum:** Kepdirjen Bimas Islam No. 473 Tahun 2020
**Penanda tangan:** Lurah Sidoharjo (untuk N1 dan N2); N4 ditandatangani kedua calon pengantin
**Deskripsi untuk kartu:** "Paket pengantar nikah untuk KUA: Model N1, N2, dan N4
sekaligus."
**Estimasi proses:** 3 hari kerja

### Hal yang harus dipahami dulu

Satu pengajuan menghasilkan **tiga dokumen sekaligus**:

| Model | Nama formulir | Isi |
|---|---|---|
| N1 | Pengantar Nikah | Data pemohon + data ayah + data ibu |
| N2 | Permohonan Kehendak Nikah | Calon suami, calon istri, waktu & tempat akad, daftar lampiran |
| N4 | Persetujuan Calon Pengantin | Data calon suami & calon istri, pernyataan sukarela |

**Jangan membuat tiga jenis surat terpisah.** Buat satu skema `PN` saja. Nanti
tahap generate dokumen akan menghasilkan tiga file dari satu data.

Begitu juga varian pria/wanita: **jangan buat dua skema.** Cukup satu field
`peranPemohon` yang menentukan varian dokumen dan label yang dipakai
(Bin vs Binti, Jejaka/Duda vs Perawan/Janda).

### Field — identitas pengajuan

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `peranPemohon` | enum | `calon-suami` \| `calon-istri` | ✅ |

### Field — data pemohon (warga Sidoharjo, subjek Model N1)

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `namaPemohon` | string | | ✅ |
| `nikPemohon` | string 16 digit | | ✅ |
| `jenisKelaminPemohon` | enum | shared `jenisKelamin` | ✅ |
| `tempatLahirPemohon` | string | | ✅ |
| `tanggalLahirPemohon` | date | | ✅ |
| `kewarganegaraanPemohon` | enum | `wni` \| `wna`, default `wni` | ✅ |
| `agamaPemohon` | enum | shared `agama` | ✅ |
| `pekerjaanPemohon` | string | | ✅ |
| `alamatPemohon` | object | shared `alamat` (dropdown padukuhan) | ✅ |
| `statusPernikahanPemohon` | enum | `jejaka` \| `duda` \| `perawan` \| `janda` | ✅ |
| `istriKe` | number int ≥ 2 | | opsional — hanya relevan jika `peranPemohon = calon-suami` dan sudah beristri |

**Validasi silang wajib:** kalau `jenisKelaminPemohon = laki-laki`, nilai
`statusPernikahanPemohon` hanya boleh `jejaka` atau `duda`. Kalau `perempuan`,
hanya boleh `perawan` atau `janda`. Pakai `superRefine`.

### Field — data ayah pemohon (Model N1 bagian "seorang pria")

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `namaAyah` | string | | ✅ |
| `nikAyah` | string 16 digit | | ✅ |
| `tempatLahirAyah` | string | | ✅ |
| `tanggalLahirAyah` | date | | ✅ |
| `kewarganegaraanAyah` | enum | `wni` \| `wna`, default `wni` | ✅ |
| `agamaAyah` | enum | shared `agama` | ✅ |
| `pekerjaanAyah` | string | | ✅ |
| `alamatAyah` | **string teks bebas** | | ✅ |

### Field — data ibu pemohon (Model N1 bagian "seorang wanita")

Sama persis strukturnya: `namaIbu`, `nikIbu`, `tempatLahirIbu`,
`tanggalLahirIbu`, `kewarganegaraanIbu`, `agamaIbu`, `pekerjaanIbu`,
`alamatIbu` (string teks bebas).

**Catatan:** ini BERBEDA dari `dataOrangTua` yang sudah ada di
`shared.schema.ts` (yang dipakai KLH/LHM/KTN). Versi nikah butuh `agama` dan
`kewarganegaraan`, dan alamatnya teks bebas. Buat objek terpisah bernama
`dataOrangTuaNikah` di `shared.schema.ts` — **jangan mengubah `dataOrangTua`
yang lama**, karena skema KLH/LHM/KTN sudah memakainya.

### Field — data calon pasangan (Model N2 dan N4)

| Field | Tipe | Enum | Wajib |
|---|---|---|---|
| `namaCalonPasangan` | string | | ✅ |
| `binBintiCalonPasangan` | string | | ✅ — nama ayah dari calon pasangan |
| `nikCalonPasangan` | string 16 digit | | ✅ |
| `tempatLahirCalonPasangan` | string | | ✅ |
| `tanggalLahirCalonPasangan` | date | | ✅ |
| `kewarganegaraanCalonPasangan` | enum | `wni` \| `wna`, default `wni` | ✅ |
| `agamaCalonPasangan` | enum | shared `agama` | ✅ |
| `pekerjaanCalonPasangan` | string | | ✅ |
| `alamatCalonPasangan` | **string teks bebas** | | ✅ |

**Jangan buat field `binBintiPemohon`.** Nilainya diturunkan otomatis dari
`namaAyah` yang sudah diisi di blok ayah. Label "Bin" atau "Binti" ditentukan
dari `jenisKelaminPemohon`.

### Field — rencana akad (Model N2)

| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| `tanggalAkad` | date | ✅ | harus di masa depan; nama hari diturunkan otomatis |
| `jamAkad` | string `HH:mm` | ✅ | |
| `tempatAkad` | string | ✅ | |
| `kuaTujuan` | string | ✅ | default `"KUA Kapanewon Tepus"` |

### Field — lampiran tambahan (Model N2)

Model N2 punya daftar berkas nomor 1–6 yang **sudah tercetak tetap** di template
(surat pengantar nikah, persetujuan calon mempelai, fotokopi KTP, fotokopi akta
kelahiran, fotokopi kartu keluarga, pas foto 2x3 tiga lembar latar biru). Jangan
buat field untuk keenam item ini — itu teks baku.

Nomor 7 dan 8 kosong dan bisa diisi manual:

| Field | Tipe | Wajib |
|---|---|---|
| `lampiranTambahan` | array of string, maksimal 2 item | opsional |

---

## Yang harus kamu kerjakan

1. Buat tiga file skema Zod sesuai path di atas, ikuti persis gaya file skema
   yang sudah ada (lihat `sku.schema.ts` dan `sktm.schema.ts` sebagai acuan).
2. Tambahkan `dataOrangTuaNikah` ke `shared.schema.ts` tanpa mengubah
   `dataOrangTua` yang lama. Tambahkan juga enum `kewarganegaraan`
   (`wni` | `wna`) kalau belum ada.
3. Buat halaman formulir pengisian untuk ketiga jenis surat, mengikuti pola
   halaman form yang sudah ada (React Hook Form + zodResolver + komponen
   shadcn/ui yang sama).
4. Untuk `PN`, kelompokkan formulirnya jadi beberapa langkah atau section
   dengan judul jelas: Data Pemohon, Data Ayah, Data Ibu, Data Calon Pasangan,
   Rencana Akad, Lampiran. Formulirnya panjang — jangan satu halaman datar
   tanpa pengelompokan.
5. Daftarkan ketiga jenis surat baru ke halaman "Jenis Surat yang Tersedia",
   pakai kode, judul, deskripsi, dan estimasi proses seperti tertulis di atas.
6. Pastikan validasi silang yang disebutkan (status pernikahan vs jenis kelamin,
   tanggal akad harus di masa depan) benar-benar diimplementasikan, bukan hanya
   dikomentari.

## Yang JANGAN kamu kerjakan

- Jangan menyentuh skema KLH, LHM, KTN, SKU, SKTM, atau SKPD.
- Jangan mengubah `dataOrangTua` yang lama.
- Jangan membuat jenis surat terpisah untuk N1, N2, dan N4 — ketiganya satu
  pengajuan `PN`.
- Jangan membuat dua skema untuk varian pria dan wanita.
- Jangan mengerjakan generate `.docx` dulu. Tahap ini hanya skema + formulir.
- Jangan menambah field di luar daftar di atas.

## Setelah selesai

Laporkan dalam bentuk daftar singkat:
- file apa saja yang dibuat dan diubah,
- field mana saja yang kamu tandai opsional dan alasannya,
- bagian mana yang kamu ragu dan perlu dikonfirmasi ke pihak kelurahan.
