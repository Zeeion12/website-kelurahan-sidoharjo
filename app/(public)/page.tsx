import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { JENIS_SURAT } from "@/config/jenis-surat";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <section className="relative overflow-hidden border-b border-white/10 bg-linear-to-br from-emerald-950 via-green-900 to-neutral-950">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)]"
                />
                <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 py-16">
                    <Badge className="border-white/20 bg-white/10 text-white">
                        Kalurahan Sidoharjo, Kapanewon Tepus
                    </Badge>
                    <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Ajukan surat keterangan tanpa perlu datang berkali-kali
                    </h1>
                    <p className="max-w-2xl text-white/70">
                        Pilih jenis surat, isi data yang diperlukan, dan dapatkan nomor
                        tiket untuk memantau status pengajuan Anda secara online.
                    </p>
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                        <Button size="lg" nativeButton={false} render={<Link href="#layanan" />}>
                            <FileText />
                            Pilih Jenis Surat
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                            nativeButton={false}
                            render={<Link href="/status" />}
                        >
                            <Search />
                            Cek Status Pengajuan
                        </Button>
                    </div>
                </div>
            </section>

            <section id="layanan" className="mx-auto w-full max-w-5xl px-4 py-16">
                <div className="mb-8 flex flex-col gap-1">
                    <h2 className="font-heading text-xl font-semibold">
                        Jenis Surat yang Tersedia
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Klik salah satu layanan di bawah untuk mulai mengisi formulir
                        pengajuan.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {JENIS_SURAT.map((jenis) => (
                        <Card key={jenis.id} className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="mb-1 flex flex-wrap items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="outline">{jenis.kode}</Badge>
                                        {jenis.instansi === "dukcapil" && (
                                            <Badge className="border-amber-600/30 bg-amber-50 text-amber-800">
                                                Formulir Dukcapil
                                            </Badge>
                                        )}
                                    </div>
                                    {!jenis.tersedia && (
                                        <Badge variant="secondary">Segera hadir</Badge>
                                    )}
                                </div>
                                <CardTitle>{jenis.nama}</CardTitle>
                                <CardDescription>{jenis.deskripsi}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {jenis.tersedia
                                    ? `Estimasi proses ${jenis.estimasiHari} hari kerja`
                                    : "Menunggu contoh format resmi dari Kelurahan"}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    disabled={!jenis.tersedia}
                                    nativeButton={false}
                                    render={<Link href={`/formulir/${jenis.id}`} />}
                                >
                                    Ajukan Sekarang
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
