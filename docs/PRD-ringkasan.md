# Ringkasan PRD Jadimulya V3 (untuk referensi cepat saat development)

Dokumen lengkap: `PRD-Jadimulya-V3.docx` (di luar repo ini, simpan di
tempat yang bisa diakses tim).

## Modul MVP (Must Have)

1. **Homepage** — hero slider, slogan Sunda, counter (Penduduk/KK/Luas
   Wilayah), highlight potensi + 3 berita terbaru, tombol "Jelajahi Desa",
   logo Kab. Pangandaran.
2. **SOTK** (Struktur Organisasi dan Tata Kelola Pemerintah Desa) — 14
   aparatur/6 bidang, kartu Kepala Desa terpisah, kontak (email, telp/WA,
   Facebook), tanpa NIP.
3. **Potensi Desa** — kategori Pertanian & Pariwisata (UMKM ditunda),
   filter kategori, CTA kemitraan, unduh katalog PDF/Docs.
4. **Sejarah Desa** — narasi berjenjang + TOC interaktif, milestone
   1928–sekarang, foto kuwu terdahulu, kotak Visi, **CMS-editable**.
5. **Statistik/Demografi** — ringkasan (Penduduk/KK/L/P), grafik gender/usia/
   jenis pekerjaan, rincian per Dusun.
6. **Admin CMS** — auth, CRUD semua modul di atas, kategori berita
   (Pembangunan, Kesehatan, Pertanian, Wisata, dll), upload media dasar.

## Next Phase (Should Have) — jangan dibangun dulu

- Layanan Mandiri (surat online)
- Sistem pengaduan/aspirasi warga online
- AI Assistant penulisan berita
- Kategori Potensi UMKM tampil publik
- Dashboard analitik lanjutan, media manager lanjutan

## Item Menunggu Konfirmasi Desa — default TIDAK masuk MVP

- Tombol aksi khusus per potensi (mis. "Pesan Tiket") — default: satu
  tombol umum "Lihat Detail".
- Warga submit foto/cerita sejarah sendiri.
- Data kependudukan detail per warga (bukan agregat).
- Unduh laporan Statistik PDF terpisah dari katalog Potensi.

## Keputusan Desain Fix

- Palet warna: biru muda (perisai logo Kab. Pangandaran), bukan hijau.
- Newsletter email: dihapus permanen, tidak masuk fase manapun.
