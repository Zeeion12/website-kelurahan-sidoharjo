import fs from "node:fs";
import path from "node:path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { getJenisSuratById } from "@/config/jenis-surat";
import { formatTanggal, humanizeValue } from "@/lib/format";
import { suratPunyaTemplate } from "@/lib/template-surat";
import type { Pengajuan } from "@/types/pengajuan";

/** Server-only: baca & isi template .docx. Jangan diimpor dari client component. */

// Merapikan tiap nilai daun ("belum-kawin" -> "Belum Kawin", tanggal ISO,
// dst) tanpa mengubah bentuk objek/array -- supaya path seperti
// {{alamatAyah.padukuhan}} dan loop {{#anggotaKeluarga}} di template tetap
// bisa mengakses field yang sama seperti sebelum dirapikan.
function humanizeDeep(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => humanizeDeep(item));
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, v]) => [key, humanizeDeep(v)])
        );
    }
    return humanizeValue(value);
}

// Tambahkan nomor urut ("no") ke tiap baris array -- dipakai template untuk
// kolom nomor di tabel daftar anggota keluarga/keluarga yang pindah.
function tambahkanNomorUrut(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map((item, index) => {
            const hasil = tambahkanNomorUrut(item);
            if (hasil && typeof hasil === "object" && !Array.isArray(hasil)) {
                return { no: index + 1, ...hasil };
            }
            return hasil;
        });
    }
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, v]) => [key, tambahkanNomorUrut(v)])
        );
    }
    return value;
}

function isAlamatSingkat(obj: Record<string, unknown>): boolean {
    return Object.keys(obj).sort().join(",") === "padukuhan,rt,rw";
}

function isAlamatTujuanLengkap(obj: Record<string, unknown>): boolean {
    const keys = new Set(Object.keys(obj));
    return ["alamat", "rt", "rw", "kalurahan", "kapanewon", "kabupaten", "provinsi", "kodePos"].every(
        (k) => keys.has(k)
    );
}

// Sebagian template (mis. SKU) menulis alamat sebagai satu tag polos
// {{alamat}}, sementara sebagian lain (mis. KLH) menulis path bertingkat
// {{alamatAyah.padukuhan}}. Supaya dua-duanya jalan tanpa perlu tahu dulu
// gaya template mana yang dipakai, objek alamat diberi `toString` kustom --
// path bertingkat tetap bisa diakses seperti biasa, tapi kalau template
// memakai tag polos, hasilnya string yang sudah rapi, bukan "[object Object]".
function tambahkanToStringAlamat(value: unknown): unknown {
    if (Array.isArray(value)) {
        value.forEach(tambahkanToStringAlamat);
        return value;
    }
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (isAlamatSingkat(obj)) {
            Object.defineProperty(obj, "toString", {
                value: () => `${obj.padukuhan} RT ${obj.rt} / RW ${obj.rw}`,
            });
        } else if (isAlamatTujuanLengkap(obj)) {
            Object.defineProperty(obj, "toString", {
                value: () =>
                    `${obj.alamat} RT ${obj.rt} / RW ${obj.rw}, ${obj.kalurahan}, ${obj.kapanewon}, ${obj.kabupaten}, ${obj.provinsi} ${obj.kodePos}`,
            });
        } else {
            Object.values(obj).forEach(tambahkanToStringAlamat);
        }
    }
    return value;
}

export async function generateSuratDocx(pengajuan: Pengajuan): Promise<Buffer> {
    const jenis = getJenisSuratById(pengajuan.jenis_surat);
    if (!jenis || !suratPunyaTemplate(pengajuan.jenis_surat)) {
        throw new Error(`Template surat untuk jenis "${pengajuan.jenis_surat}" belum tersedia`);
    }

    const templatePath = path.join(process.cwd(), "templates", "surat", `template-${jenis.kode}.docx`);
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
        nullGetter: () => "-",
    });

    const dataRapi = tambahkanNomorUrut(humanizeDeep(pengajuan.data)) as Record<string, unknown>;
    tambahkanToStringAlamat(dataRapi);

    doc.render({
        ...dataRapi,
        // Dua field ini tidak tersimpan di kolom `data` (jsonb) -- nomor
        // tiket & jenis_surat ada di kolom sendiri, tanggal pengajuan
        // diambil dari created_at -- jadi disuntikkan manual di sini.
        nomorTiket: pengajuan.nomor_tiket,
        tanggalPengajuan: formatTanggal(pengajuan.created_at),
    });

    return doc.getZip().generate({ type: "nodebuffer" });
}
