-- Perbarui daftar jenis_surat yang valid:
-- - hapus 'izin-usaha' (SIU dibatalkan, sudah dipastikan sama dengan SKU)
-- - tambah 3 surat nikah yang sudah ada skema & formulirnya di aplikasi
--   tapi belum pernah dimasukkan ke constraint ini (RKN, DPN, PN)
alter table public.pengajuan
    drop constraint if exists pengajuan_jenis_surat_check;

alter table public.pengajuan
    add constraint pengajuan_jenis_surat_check check (jenis_surat in (
        'kelahiran', 'lahir-mati', 'kematian', 'sku',
        'keterangan-tidak-mampu', 'pindah-domisili',
        'rekomendasi-nikah', 'dispensasi-nikah', 'pengantar-nikah'
    ));
