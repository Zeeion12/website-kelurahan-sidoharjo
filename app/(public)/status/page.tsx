import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getJenisSuratById } from "@/config/jenis-surat";
import { formatTanggal } from "@/lib/format";
import { cekStatusPengajuan } from "@/lib/pengajuan-server";
import { STATUS_BADGE_VARIANT, STATUS_DESKRIPSI, STATUS_LABEL } from "@/lib/status";

export default async function StatusPage({
    searchParams,
}: {
    searchParams: Promise<{ tiket?: string }>;
}) {
    const { tiket } = await searchParams;
    const nomorTiket = tiket?.trim() ?? "";
    // undefined = belum mencari (tiket kosong), null = dicari tapi tidak ditemukan
    const hasil = nomorTiket ? await cekStatusPengajuan(nomorTiket) : undefined;

    return (
        <div className="mx-auto w-full max-w-xl px-4 py-12">
            <div className="mb-8 flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                    Cek Status Pengajuan
                </h1>
                <p className="text-sm text-muted-foreground">
                    Masukkan nomor tiket yang Anda dapatkan saat mengajukan surat.
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form
                        action="/status"
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="tiket">Nomor Tiket</Label>
                            <Input
                                id="tiket"
                                name="tiket"
                                placeholder="Contoh: SKU-260824-1234"
                                defaultValue={nomorTiket}
                            />
                        </div>
                        <Button type="submit">
                            <Search />
                            Cek Status
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {hasil === null && (
                <Card className="mt-4 border-dashed">
                    <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                        Nomor tiket tidak ditemukan. Pastikan nomor tiket sudah benar.
                    </CardContent>
                </Card>
            )}

            {hasil && (
                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle className="font-mono text-base">
                                {hasil.nomor_tiket}
                            </CardTitle>
                            <Badge variant={STATUS_BADGE_VARIANT[hasil.status]}>
                                {STATUS_LABEL[hasil.status]}
                            </Badge>
                        </div>
                        <CardDescription>
                            {getJenisSuratById(hasil.jenis_surat)?.nama}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-sm">
                        <p className="text-muted-foreground">
                            Diajukan pada {formatTanggal(hasil.created_at)}
                        </p>
                        <p>{STATUS_DESKRIPSI[hasil.status]}</p>
                        {hasil.catatan_petugas && (
                            <p className="rounded-md bg-muted/50 p-3 text-muted-foreground">
                                Catatan petugas: {hasil.catatan_petugas}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
