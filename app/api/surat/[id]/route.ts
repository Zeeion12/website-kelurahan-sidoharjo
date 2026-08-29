import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSuratDocx } from "@/lib/generate-surat";
import type { Pengajuan } from "@/types/pengajuan";

// Node runtime wajib -- butuh akses filesystem (baca file .docx) yang tidak
// tersedia di Edge runtime.
export const runtime = "nodejs";

/**
 * Cuma boleh diakses petugas yang login. Hasilnya berkas .docx siap cetak
 * berisi data pribadi lengkap (NIK, alamat, dst) -- jangan pernah dibuka ke
 * publik/anon.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Anda harus login sebagai petugas." }, { status: 401 });
    }

    const { data: pengajuan, error } = await supabase
        .from("pengajuan")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error || !pengajuan) {
        return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

    try {
        const buffer = await generateSuratDocx(pengajuan as Pengajuan);
        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="${(pengajuan as Pengajuan).nomor_tiket}.docx"`,
            },
        });
    } catch (err) {
        // Sengaja cuma log nama/pesan error, BUKAN isi `pengajuan.data` yang
        // berisi data pribadi warga.
        const pesan = err instanceof Error ? err.message : "unknown error";
        console.error(`Gagal generate surat untuk pengajuan ${id}: ${pesan}`);
        return NextResponse.json(
            { error: "Gagal membuat file surat. Coba lagi atau hubungi admin." },
            { status: 500 }
        );
    }
}
