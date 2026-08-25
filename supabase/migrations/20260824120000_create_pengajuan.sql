-- Tabel utama: satu baris per pengajuan surat dari warga.
-- `data` menyimpan seluruh isi form (NIK, alamat, dst) sebagai JSON --
-- bentuknya beda-beda tergantung `jenis_surat`, jadi tidak dipetakan ke kolom.
create extension if not exists "pgcrypto";

create table if not exists public.pengajuan (
    id uuid primary key default gen_random_uuid(),
    nomor_tiket text not null unique,
    jenis_surat text not null check (jenis_surat in (
        'kelahiran', 'lahir-mati', 'kematian', 'sku',
        'izin-usaha', 'keterangan-tidak-mampu', 'pindah-domisili'
    )),
    data jsonb not null,
    status text not null default 'menunggu' check (status in (
        'menunggu', 'diproses', 'selesai', 'ditolak'
    )),
    catatan_petugas text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    selesai_at timestamptz
);

create index if not exists pengajuan_nomor_tiket_idx on public.pengajuan (nomor_tiket);
create index if not exists pengajuan_status_idx on public.pengajuan (status);

-- updated_at & selesai_at dikelola otomatis lewat trigger, supaya kode
-- aplikasi (nanti) cukup update kolom `status`/`catatan_petugas` saja.
create or replace function public.pengajuan_before_update()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();

    if new.status = 'selesai' and old.status is distinct from 'selesai' then
        new.selesai_at = now();
    elsif new.status <> 'selesai' then
        new.selesai_at = null;
    end if;

    return new;
end;
$$;

drop trigger if exists pengajuan_before_update on public.pengajuan;
create trigger pengajuan_before_update
    before update on public.pengajuan
    for each row execute function public.pengajuan_before_update();

alter table public.pengajuan enable row level security;

-- Warga (anon, tanpa login) boleh membuat pengajuan baru, tapi tidak boleh
-- langsung mengisi status selain "menunggu" atau menitip catatan petugas.
drop policy if exists "warga dapat mengajukan surat" on public.pengajuan;
create policy "warga dapat mengajukan surat"
    on public.pengajuan
    for insert
    to anon
    with check (status = 'menunggu' and catatan_petugas is null);

-- Petugas (sudah login lewat Supabase Auth) bisa melihat & memperbarui semua
-- pengajuan. Kantor kelurahan kecil, jadi tidak dibedakan per-petugas.
drop policy if exists "petugas dapat melihat semua pengajuan" on public.pengajuan;
create policy "petugas dapat melihat semua pengajuan"
    on public.pengajuan
    for select
    to authenticated
    using (true);

drop policy if exists "petugas dapat memperbarui status" on public.pengajuan;
create policy "petugas dapat memperbarui status"
    on public.pengajuan
    for update
    to authenticated
    using (true)
    with check (true);

-- Warga mengecek status lewat nomor tiket tanpa login -- lewat fungsi ini,
-- bukan SELECT langsung ke tabel, supaya data pribadi di kolom `data`
-- (NIK, alamat, dst) tidak pernah ikut terbaca oleh publik.
create or replace function public.cek_status_pengajuan(p_nomor_tiket text)
returns table (
    nomor_tiket text,
    jenis_surat text,
    status text,
    catatan_petugas text,
    created_at timestamptz,
    selesai_at timestamptz
)
language sql
security definer
set search_path = public
as $$
    select nomor_tiket, jenis_surat, status, catatan_petugas, created_at, selesai_at
    from public.pengajuan
    where nomor_tiket = p_nomor_tiket
    limit 1;
$$;

grant execute on function public.cek_status_pengajuan(text) to anon;
