"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getJenisSuratById } from "@/config/jenis-surat";
import { updatePengajuanClient } from "@/lib/pengajuan-client";
import { STATUS_LABEL, STATUS_OPTIONS } from "@/lib/status";
import { formatTanggal, humanizeKey, humanizeValue } from "@/lib/format";
import type { StatusPengajuan } from "@/types";
import type { Pengajuan } from "@/types/pengajuan";

function DataFields({ data }: { data: Record<string, unknown> }) {
    return (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {Object.entries(data).map(([key, value]) => {
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    return (
                        <div key={key} className="sm:col-span-2">
                            <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                {humanizeKey(key)}
                            </p>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-md border border-border p-3 sm:grid-cols-2">
                                {Object.entries(value as Record<string, unknown>).map(
                                    ([subKey, subValue]) => (
                                        <div key={subKey} className="flex flex-col">
                                            <dt className="text-xs text-muted-foreground">
                                                {humanizeKey(subKey)}
                                            </dt>
                                            <dd className="text-sm">{humanizeValue(subValue)}</dd>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={key} className="flex flex-col">
                        <dt className="text-xs text-muted-foreground">{humanizeKey(key)}</dt>
                        <dd className="text-sm">{humanizeValue(value)}</dd>
                    </div>
                );
            })}
        </dl>
    );
}

interface PengajuanEditorProps {
    pengajuan: Pengajuan;
}

export function PengajuanEditor({ pengajuan }: PengajuanEditorProps) {
    const router = useRouter();
    // status & catatan sengaja hanya di-seed sekali dari `pengajuan` saat
    // komponen ini pertama kali mount -- supaya field yang sedang diedit
    // tidak tertimpa kalau server component induknya refresh.
    const [status, setStatus] = useState<StatusPengajuan>(pengajuan.status);
    const [catatan, setCatatan] = useState(pengajuan.catatan_petugas ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSimpan() {
        setIsSaving(true);
        setErrorMessage(null);
        try {
            await updatePengajuanClient(pengajuan.id, {
                status,
                catatan_petugas: catatan.trim() ? catatan.trim() : null,
            });
            setSavedMessage("Perubahan tersimpan.");
            router.refresh();
        } catch {
            setErrorMessage("Gagal menyimpan perubahan. Coba lagi.");
        } finally {
            setIsSaving(false);
        }
    }

    const jenisSurat = getJenisSuratById(pengajuan.jenis_surat);

    return (
        <div className="flex flex-col gap-6">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Kembali ke Daftar Pengajuan
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="font-mono text-base">
                            {pengajuan.nomor_tiket}
                        </CardTitle>
                        <StatusBadge status={pengajuan.status} />
                    </div>
                    <CardDescription>{jenisSurat?.nama}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Diajukan pada {formatTanggal(pengajuan.created_at)}
                    </p>
                    <DataFields data={pengajuan.data} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Update Status</CardTitle>
                    <CardDescription>
                        Perbarui status setelah surat mulai/selesai dikerjakan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value as StatusPengajuan);
                                setSavedMessage(null);
                            }}
                        >
                            <SelectTrigger id="status" className="w-full sm:w-64">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {STATUS_LABEL[option]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="catatan">Catatan untuk Warga (opsional)</Label>
                        <Textarea
                            id="catatan"
                            rows={3}
                            value={catatan}
                            onChange={(e) => {
                                setCatatan(e.target.value);
                                setSavedMessage(null);
                            }}
                            placeholder="Contoh: Surat sudah bisa diambil di kantor Kelurahan."
                        />
                    </div>
                    {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                    <div className="flex items-center gap-3">
                        <Button onClick={handleSimpan} disabled={isSaving}>
                            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        {savedMessage && (
                            <span className="text-sm text-muted-foreground">{savedMessage}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
