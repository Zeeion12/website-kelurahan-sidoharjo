import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { JenisSuratConfig } from "@/types";

interface TicketResultProps {
    nomorTiket: string;
    jenisSurat: JenisSuratConfig;
}

export function TicketResult({ nomorTiket, jenisSurat }: TicketResultProps) {
    return (
        <Card className="mx-auto w-full max-w-lg">
            <CardHeader className="items-center text-center">
                <CheckCircle2 className="mb-2 size-10 text-primary" />
                <CardTitle className="text-lg">Pengajuan berhasil dikirim</CardTitle>
                <CardDescription>{jenisSurat.nama}</CardDescription>
            </CardHeader>
            <CardContent className="items-center gap-4 text-center">
                <div className="rounded-lg border border-dashed border-border bg-muted/40 py-4">
                    <p className="text-xs text-muted-foreground">Nomor Tiket Anda</p>
                    <p className="font-mono text-2xl font-semibold tracking-wider">
                        {nomorTiket}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Simpan nomor tiket ini untuk mengecek status pengajuan. Perkiraan
                    waktu proses sekitar {jenisSurat.estimasiHari} hari kerja. Surat dapat
                    diambil langsung di kantor Kalurahan Sidoharjo setelah selesai dibuat.
                </p>
                <div className="flex w-full flex-col gap-2 pt-2 sm:flex-row">
                    <Button
                        className="flex-1"
                        nativeButton={false}
                        render={<Link href={`/status?tiket=${encodeURIComponent(nomorTiket)}`} />}
                    >
                        Cek Status Pengajuan
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        nativeButton={false}
                        render={<Link href="/" />}
                    >
                        Kembali ke Beranda
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
