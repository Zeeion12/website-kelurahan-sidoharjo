"use client";

import { useSyncExternalStore } from "react";
import {
    getAllPengajuan,
    getPengajuanById,
    getPengajuanByTiket,
    subscribePengajuanStore,
} from "@/lib/pengajuan-store";
import type { Pengajuan } from "@/types/pengajuan";

const EMPTY_LIST: Pengajuan[] = [];

function getEmptyServerSnapshot() {
    return EMPTY_LIST;
}

function getUndefinedServerSnapshot() {
    return undefined;
}

/** Daftar semua pengajuan, otomatis update saat store berubah. */
export function useAllPengajuan(): Pengajuan[] {
    return useSyncExternalStore(subscribePengajuanStore, getAllPengajuan, getEmptyServerSnapshot);
}

/** Satu pengajuan berdasarkan id: undefined = belum siap, null = tidak ditemukan. */
export function usePengajuanById(id: string): Pengajuan | null | undefined {
    return useSyncExternalStore(
        subscribePengajuanStore,
        () => getPengajuanById(id) ?? null,
        getUndefinedServerSnapshot
    );
}

/**
 * Satu pengajuan berdasarkan nomor tiket: undefined = belum dicari (tiket
 * kosong), null = dicari tapi tidak ditemukan.
 */
export function usePengajuanByTiket(nomorTiket: string): Pengajuan | null | undefined {
    return useSyncExternalStore(
        subscribePengajuanStore,
        () => (nomorTiket ? (getPengajuanByTiket(nomorTiket) ?? null) : undefined),
        getUndefinedServerSnapshot
    );
}
