-- Tambahkan 3 formulir Dukcapil baru (PED, PPK, BDK) ke daftar jenis_surat
-- yang valid. Sama seperti migrasi sebelumnya untuk RKN/DPN/PN -- tanpa ini,
-- submit ketiga formulir baru ini akan gagal karena melanggar CHECK constraint.
alter table public.pengajuan
    drop constraint if exists pengajuan_jenis_surat_check;

alter table public.pengajuan
    add constraint pengajuan_jenis_surat_check check (jenis_surat in (
        'kelahiran', 'lahir-mati', 'kematian', 'sku',
        'keterangan-tidak-mampu', 'pindah-domisili',
        'rekomendasi-nikah', 'dispensasi-nikah', 'pengantar-nikah',
        'perubahan-elemen-data', 'peristiwa-kependudukan', 'biodata-keluarga'
    ));
