import { createClient } from "@/lib/supabase/server";
import type { Pengajuan, PengajuanStatusPublik } from "@/types/pengajuan";

/** Dipakai halaman "Cek Status" publik -- lewat RPC, bukan SELECT langsung,
 * supaya data pribadi (NIK, alamat, dst di kolom `data`) tidak pernah ikut. */
export async function cekStatusPengajuan(
    nomorTiket: string
): Promise<PengajuanStatusPublik | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc("cek_status_pengajuan", { p_nomor_tiket: nomorTiket })
        .maybeSingle();

    if (error) throw error;
    return (data as PengajuanStatusPublik | null) ?? null;
}

/** Dipakai dashboard petugas (RLS: hanya role `authenticated` yang boleh baca). */
export async function getAllPengajuanServer(): Promise<Pengajuan[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pengajuan")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Pengajuan[]) ?? [];
}

export async function getPengajuanByIdServer(id: string): Promise<Pengajuan | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pengajuan")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return (data as Pengajuan | null) ?? null;
}
