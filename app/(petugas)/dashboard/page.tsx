import { PengajuanList } from "@/components/dashboard/pengajuan-list";
import { getAllPengajuanServer } from "@/lib/pengajuan-server";

export default async function DashboardPage() {
    const items = await getAllPengajuanServer();

    return <PengajuanList items={items} />;
}
