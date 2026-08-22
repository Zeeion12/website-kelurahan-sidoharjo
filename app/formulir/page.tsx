import Link from "next/link";
import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

type JenisPelaporan = {
  id: string;
  label: string;
  deskripsi: string;
  href: string;
};

type Kategori = {
  nama: string;
  keterangan: string;
  jenis: JenisPelaporan[];
};

const kategoriPelaporan: Kategori[] = [
  {
    nama: "Kelahiran & Kematian",
    keterangan: "Peristiwa vital yang wajib dicatat sejak terjadi",
    jenis: [
      {
        id: "kelahiran",
        label: "Kelahiran",
        deskripsi: "Pendaftaran kelahiran anak",
        href: "/formulir/kelahiran",
      },
      {
        id: "lahir-mati",
        label: "Lahir Mati",
        deskripsi: "Pencatatan bayi yang lahir dalam keadaan meninggal",
        href: "/formulir/lahir-mati",
      },
      {
        id: "kematian",
        label: "Kematian",
        deskripsi: "Pendaftaran kematian penduduk",
        href: "/formulir/kematian",
      },
    ],
  },
  {
    nama: "Perkawinan & Perceraian",
    keterangan: "Termasuk pembatalan bila diperlukan",
    jenis: [
      {
        id: "perkawinan",
        label: "Perkawinan",
        deskripsi: "Pencatatan peristiwa perkawinan",
        href: "/formulir/perkawinan",
      },
      {
        id: "pembatalan-perkawinan",
        label: "Pembatalan Perkawinan",
        deskripsi: "Pembatalan akta perkawinan yang sudah terbit",
        href: "/formulir/pembatalan-perkawinan",
      },
      {
        id: "perceraian",
        label: "Perceraian",
        deskripsi: "Pencatatan peristiwa perceraian",
        href: "/formulir/perceraian",
      },
      {
        id: "pembatalan-perceraian",
        label: "Pembatalan Perceraian",
        deskripsi: "Pembatalan akta perceraian yang sudah terbit",
        href: "/formulir/pembatalan-perceraian",
      },
    ],
  },
  {
    nama: "Status Anak",
    keterangan: "Pengangkatan, pengakuan, dan pengesahan anak",
    jenis: [
      {
        id: "pengangkatan-anak",
        label: "Pengangkatan Anak",
        deskripsi: "Pencatatan pengangkatan anak",
        href: "/formulir/pengangkatan-anak",
      },
      {
        id: "pengakuan-anak",
        label: "Pengakuan Anak",
        deskripsi: "Pencatatan pengakuan anak oleh orang tua kandung",
        href: "/formulir/pengakuan-anak",
      },
      {
        id: "pengesahan-anak",
        label: "Pengesahan Anak",
        deskripsi: "Pencatatan pengesahan anak akibat perkawinan orang tua",
        href: "/formulir/pengesahan-anak",
      },
    ],
  },
  {
    nama: "Perubahan Data",
    keterangan: "Nama dan status kewarganegaraan",
    jenis: [
      {
        id: "perubahan-nama",
        label: "Perubahan Nama",
        deskripsi: "Pencatatan perubahan nama pada akta",
        href: "/formulir/perubahan-nama",
      },
      {
        id: "perubahan-kewarganegaraan",
        label: "Perubahan Status Kewarganegaraan",
        deskripsi: "Pencatatan perubahan status kewarganegaraan",
        href: "/formulir/perubahan-kewarganegaraan",
      },
    ],
  },
  {
    nama: "Lainnya & Perbaikan Akta",
    keterangan: "Peristiwa penting lain serta koreksi akta",
    jenis: [
      {
        id: "peristiwa-penting-lainnya",
        label: "Peristiwa Penting Lainnya",
        deskripsi: "Pencatatan peristiwa penting di luar kategori lain",
        href: "/formulir/peristiwa-penting-lainnya",
      },
      {
        id: "pembetulan-akta",
        label: "Pembetulan Akta",
        deskripsi: "Perbaikan data pada akta yang sudah terbit",
        href: "/formulir/pembetulan-akta",
      },
      {
        id: "pembatalan-akta",
        label: "Pembatalan Akta",
        deskripsi: "Pembatalan akta yang sudah terbit",
        href: "/formulir/pembatalan-akta",
      },
      {
        id: "pelaporan-luar-nkri",
        label: "Pelaporan dari Luar Wilayah NKRI",
        deskripsi: "Pencatatan peristiwa sipil yang terjadi di luar negeri",
        href: "/formulir/pelaporan-luar-nkri",
      },
    ],
  },
];

export default function PilihJenisPelaporanPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#1E2A4A]">
      <header className="border-b border-[#1E2A4A]/10 bg-white/60">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#9B2C2C]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#9B2C2C]/40 text-[10px] font-semibold">
              F-2.01
            </span>
            Layanan Pencatatan Sipil — Kalurahan Sidoharjo
          </div>
          <h1
            className={`${lora.className} mt-4 text-3xl font-semibold leading-tight md:text-4xl`}
          >
            Pilih Jenis Pelaporan Pencatatan Sipil
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#1E2A4A]/70 md:text-base">
            Pilih peristiwa yang akan Bapak/Ibu laporkan. Formulir akan
            menyesuaikan pertanyaan sesuai jenis yang dipilih.
          </p>
          <p className="mt-4 max-w-2xl rounded-sm border border-dashed border-[#1E2A4A]/25 bg-white/70 px-4 py-3 text-xs text-[#1E2A4A]/60">
            Siapkan NIK, Nomor Kartu Keluarga, dan dokumen pendukung terkait
            sebelum mulai mengisi.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
        {kategoriPelaporan.map((kategori) => (
          <section key={kategori.nama}>
            <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-dashed border-[#1E2A4A]/20 pb-2">
              <h2 className={`${lora.className} text-lg font-semibold`}>
                {kategori.nama}
              </h2>
              <span className="hidden text-xs text-[#1E2A4A]/50 sm:inline">
                {kategori.keterangan}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kategori.jenis.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-b-sm border-t-2 border-dashed border-[#1E2A4A]/25 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9B2C2C] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B2C2C]"
                >
                  <div>
                    <h3 className="font-medium text-[#1E2A4A]">
                      {item.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#1E2A4A]/60">
                      {item.deskripsi}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#9B2C2C] opacity-0 transition group-hover:opacity-100">
                    Isi formulir →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}