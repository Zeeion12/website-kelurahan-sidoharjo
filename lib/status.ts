import type { StatusPengajuan } from "@/types";

export const STATUS_LABEL: Record<StatusPengajuan, string> = {
    menunggu: "Menunggu Diproses",
    diproses: "Sedang Diproses",
    selesai: "Selesai, Siap Diambil",
    ditolak: "Ditolak",
};

export const STATUS_DESKRIPSI: Record<StatusPengajuan, string> = {
    menunggu: "Pengajuan Anda sudah kami terima dan sedang mengantre untuk diproses petugas.",
    diproses: "Petugas Kelurahan sedang memproses surat Anda.",
    selesai: "Surat Anda sudah selesai dan bisa diambil langsung di kantor Kalurahan Sidoharjo.",
    ditolak:
        "Pengajuan Anda ditolak. Silakan hubungi kantor Kalurahan Sidoharjo untuk informasi lebih lanjut.",
};

export const STATUS_OPTIONS: StatusPengajuan[] = [
    "menunggu",
    "diproses",
    "selesai",
    "ditolak",
];

export const STATUS_BADGE_VARIANT: Record<
    StatusPengajuan,
    "outline" | "secondary" | "default" | "destructive"
> = {
    menunggu: "outline",
    diproses: "secondary",
    selesai: "default",
    ditolak: "destructive",
};
