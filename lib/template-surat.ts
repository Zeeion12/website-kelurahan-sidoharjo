import { getJenisSuratById } from "@/config/jenis-surat";
import type { JenisSuratId } from "@/types";

/**
 * Kode surat yang sudah punya file template .docx di templates/surat/.
 * File tidak boleh diimpor di sini (harus aman dipakai dari client component
 * seperti tombol unduh di dashboard) -- pengecekan file fisiknya ada di
 * lib/generate-surat.ts (server-only).
 */
const KODE_TEMPLATE_TERSEDIA = new Set([
    "KLH",
    "LHM",
    "KTN",
    "SKU",
    "SKTM",
    "SKPD",
    "RKN",
    "DPN",
    "PN",
    "PED",
    "PPK",
    "BDK",
]);

export function suratPunyaTemplate(jenisSurat: JenisSuratId): boolean {
    const kode = getJenisSuratById(jenisSurat)?.kode;
    return kode ? KODE_TEMPLATE_TERSEDIA.has(kode) : false;
}
