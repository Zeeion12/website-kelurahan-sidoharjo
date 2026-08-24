export function formatTanggal(iso: string): string {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

const ISTILAH_KHUSUS = ["nik", "rt", "rw", "ktp", "kk", "rs"];

/** "namaAyah" -> "Nama Ayah", "nikAyah" -> "NIK Ayah" */
export function humanizeKey(key: string): string {
    const words = key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(/[\s._]+/)
        .filter(Boolean);

    return words
        .map((word) => {
            const lower = word.toLowerCase();
            if (ISTILAH_KHUSUS.includes(lower)) return lower.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

/** Merapikan nilai mentah dari form: tanggal ISO dan slug enum ("belum-kawin"). */
export function humanizeValue(value: unknown): string {
    if (value === "" || value === null || value === undefined) return "-";

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return formatTanggal(value);
    }

    if (typeof value === "string" && /^[a-z]+(-[a-z0-9]+)+$/.test(value)) {
        return value
            .split("-")
            .map((word) =>
                ISTILAH_KHUSUS.includes(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    }

    return String(value);
}
