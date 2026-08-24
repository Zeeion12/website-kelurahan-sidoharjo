export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-8 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                    Pemerintah Kalurahan Sidoharjo, Kapanewon Tepus, Kabupaten Gunungkidul
                </p>
                <p>Bintaos, Sidoharjo, Tepus, Gunungkidul, Kode Pos 55881</p>
                <p>Email: sidoharjotepus.1949@gmail.com</p>
                <p className="mt-4 text-xs">
                    &copy; {new Date().getFullYear()} Kalurahan Sidoharjo. Layanan surat online.
                </p>
            </div>
        </footer>
    );
}
