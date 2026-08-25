"use client";

import { useState } from "react";
import { PengajuanTable } from "@/components/dashboard/pengajuan-table";
import { STATUS_LABEL, STATUS_OPTIONS } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { StatusPengajuan } from "@/types";
import type { Pengajuan } from "@/types/pengajuan";

type FilterValue = StatusPengajuan | "semua";

const FILTERS: Array<{ value: FilterValue; label: string }> = [
    { value: "semua", label: "Semua" },
    ...STATUS_OPTIONS.map((status) => ({ value: status, label: STATUS_LABEL[status] })),
];

interface PengajuanListProps {
    items: Pengajuan[];
}

export function PengajuanList({ items }: PengajuanListProps) {
    const [filter, setFilter] = useState<FilterValue>("semua");

    const filtered = filter === "semua" ? items : items.filter((item) => item.status === filter);

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

            <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setFilter(item.value)}
                        className={cn(
                            "rounded-full border px-3 py-1 text-sm transition-colors",
                            filter === item.value
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <PengajuanTable items={filtered} />
        </div>
    );
}
