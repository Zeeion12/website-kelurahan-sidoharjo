import type { Pengajuan, PengajuanInsert } from "@/types/pengajuan";

/**
 * Penyimpanan sementara di localStorage karena tabel `pengajuan` di Supabase
 * belum dibuat. Hanya untuk kebutuhan demo frontend di satu browser yang sama
 * -- ganti seluruh isi file ini dengan query Supabase begitu backend siap.
 */
const STORAGE_KEY = "pengajuan-store";

// readAll() di-cache berdasarkan raw string localStorage supaya konsumen
// useSyncExternalStore (lib/use-pengajuan-store.ts) dapat referensi array
// yang stabil selama datanya belum benar-benar berubah.
let cachedRaw: string | null = null;
let cachedItems: Pengajuan[] = [];

const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((listener) => listener());
}

export function subscribePengajuanStore(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}

function readAll(): Pengajuan[] {
    if (typeof window === "undefined") return cachedItems;

    let raw: string | null;
    try {
        raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return cachedItems;
    }

    if (raw === cachedRaw) return cachedItems;

    try {
        cachedItems = raw ? (JSON.parse(raw) as Pengajuan[]) : [];
    } catch {
        cachedItems = [];
    }
    cachedRaw = raw;

    return cachedItems;
}

function writeAll(items: Pengajuan[]) {
    const raw = JSON.stringify(items);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedItems = items;
    notify();
}

export function savePengajuan(input: PengajuanInsert): Pengajuan {
    const now = new Date().toISOString();
    const pengajuan: Pengajuan = {
        id: crypto.randomUUID(),
        nomor_tiket: input.nomor_tiket,
        jenis_surat: input.jenis_surat,
        data: input.data,
        status: "menunggu",
        catatan_petugas: null,
        created_at: now,
        updated_at: now,
        selesai_at: null,
    };

    const items = readAll();
    items.push(pengajuan);
    writeAll(items);

    return pengajuan;
}

export function getPengajuanByTiket(nomorTiket: string): Pengajuan | undefined {
    const target = nomorTiket.trim().toLowerCase();
    return readAll().find((item) => item.nomor_tiket.toLowerCase() === target);
}

export function getPengajuanById(id: string): Pengajuan | undefined {
    return readAll().find((item) => item.id === id);
}

export function getAllPengajuan(): Pengajuan[] {
    return readAll().sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function updatePengajuan(
    id: string,
    updates: Partial<Pick<Pengajuan, "status" | "catatan_petugas">>
): Pengajuan | undefined {
    const items = readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    const current = items[index];
    const updated: Pengajuan = {
        ...current,
        ...updates,
        updated_at: now,
        selesai_at: updates.status === "selesai" ? now : current.selesai_at,
    };
    items[index] = updated;
    writeAll(items);

    return updated;
}
