"use client";

import { createClient } from "@/lib/supabase/client";
import { generateNomorTiket } from "@/lib/generate-tiket";
import type { Pengajuan, PengajuanInput } from "@/types/pengajuan";

const MAX_TIKET_ATTEMPTS = 5;

/**
 * Dipanggil dari form warga (anon). Nomor tiket dibuat & di-retry di sini
 * (bukan diterima dari luar) supaya bisa dicoba ulang kalau kebetulan
 * bentrok dengan tiket yang sudah ada (constraint unique di database).
 */
export async function savePengajuan(input: PengajuanInput): Promise<string> {
    const supabase = createClient();

    for (let attempt = 0; attempt < MAX_TIKET_ATTEMPTS; attempt++) {
        const nomorTiket = generateNomorTiket(input.jenisSurat);
        const { error } = await supabase.from("pengajuan").insert({
            nomor_tiket: nomorTiket,
            jenis_surat: input.jenisSurat,
            data: input.data,
        });

        if (!error) return nomorTiket;
        if (error.code !== "23505") throw error;
        // nomor tiket bentrok (sangat jarang) -- ulangi dengan nomor baru
    }

    throw new Error("Gagal membuat nomor tiket setelah beberapa percobaan, coba lagi.");
}

/** Dipanggil dari dashboard petugas (butuh sesi login, dicek lewat RLS). */
export async function updatePengajuanClient(
    id: string,
    updates: Partial<Pick<Pengajuan, "status" | "catatan_petugas">>
): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("pengajuan").update(updates).eq("id", id);
    if (error) throw error;
}
