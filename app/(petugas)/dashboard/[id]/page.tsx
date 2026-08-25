import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PengajuanEditor } from "@/components/dashboard/pengajuan-editor";
import { getPengajuanByIdServer } from "@/lib/pengajuan-server";

export default async function DetailPengajuanPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const pengajuan = await getPengajuanByIdServer(id);

    if (!pengajuan) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-sm text-muted-foreground">Pengajuan tidak ditemukan.</p>
                <Button variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
                    Kembali ke Dashboard
                </Button>
            </div>
        );
    }

    return <PengajuanEditor pengajuan={pengajuan} />;
}
