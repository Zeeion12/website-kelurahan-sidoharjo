"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PengajuanTable } from "@/components/dashboard/pengajuan-table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { JENIS_SURAT } from "@/config/jenis-surat";
import { STATUS_LABEL, STATUS_OPTIONS } from "@/lib/status";
import type { JenisSuratId, StatusPengajuan } from "@/types";
import type { Pengajuan } from "@/types/pengajuan";

type StatusFilterValue = StatusPengajuan | "Semua Status";
type JenisFilterValue = JenisSuratId | "Semua Jenis Surat";

interface PengajuanListProps {
    items: Pengajuan[];
}

export function PengajuanList({ items }: PengajuanListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("Semua Status");
    const [jenisFilter, setJenisFilter] = useState<JenisFilterValue>("Semua Jenis Surat");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return items.filter((item) => {
            if (statusFilter !== "Semua Status" && item.status !== statusFilter) return false;
            if (jenisFilter !== "Semua Jenis Surat" && item.jenis_surat !== jenisFilter) return false;
            if (!query) return true;

            const haystack = `${item.nomor_tiket} ${JSON.stringify(item.data)}`.toLowerCase();
            return haystack.includes(query);
        });
    }, [items, search, statusFilter, jenisFilter]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                    Daftar Pengajuan Surat
                </h1>
                <p className="text-sm text-muted-foreground">
                    {items.length} pengajuan diterima dari warga.
                </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-green-900/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nomor tiket..."
                        className="pl-8"
                    />
                </div>

                <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilterValue)}
                >
                    <SelectTrigger className="w-full sm:w-56">
                        <SelectValue placeholder="Semua status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Semua Status">Semua Status</SelectItem>
                        {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                                {STATUS_LABEL[status]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={jenisFilter}
                    onValueChange={(value) => setJenisFilter(value as JenisFilterValue)}
                >
                    <SelectTrigger className="w-full sm:w-70">
                        <SelectValue placeholder="Semua jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Semua Jenis Surat">Semua Jenis Surat</SelectItem>
                        {JENIS_SURAT.map((jenis) => (
                            <SelectItem key={jenis.id} value={jenis.id}>
                                {jenis.kode} - {jenis.nama}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <p className="text-sm text-muted-foreground">
                Menampilkan {filtered.length} dari {items.length} pengajuan.
            </p>

            <PengajuanTable items={filtered} />
        </div>
    );
}
