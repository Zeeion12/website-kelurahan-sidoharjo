import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getJenisSuratById } from "@/config/jenis-surat";
import { formatTanggal } from "@/lib/format";
import type { Pengajuan } from "@/types/pengajuan";

interface PengajuanTableProps {
    items: Pengajuan[];
}

export function PengajuanTable({ items }: PengajuanTableProps) {
    if (items.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                Belum ada pengajuan.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nomor Tiket</TableHead>
                        <TableHead>Jenis Surat</TableHead>
                        <TableHead>Tanggal Pengajuan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.nomor_tiket}</TableCell>
                            <TableCell>{getJenisSuratById(item.jenis_surat)?.nama}</TableCell>
                            <TableCell>{formatTanggal(item.created_at)}</TableCell>
                            <TableCell>
                                <StatusBadge status={item.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                <Link
                                    href={`/dashboard/${item.id}`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Lihat Detail
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
