# Daftar Endpoint API — vs Kebutuhan Fungsional PRD

Base URL: `/api/v1`
Semua endpoint admin butuh header `Authorization: Bearer <access_token>`.

## Auth

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| POST | `/auth/login` | FR-ADM-01 | Login admin, kembalikan access + refresh token |
| POST | `/auth/refresh` | FR-ADM-01 | Perbarui access token dari refresh token |
| GET | `/auth/me` | FR-ADM-01 | Info admin yang sedang login (butuh auth) |

## Organisasi / SOTK

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| GET | `/organisasi?tier=` | FR-PUB-02 | Publik, hanya aparatur aktif; bisa filter `tier` |
| GET | `/organisasi/:id` | FR-PUB-02 | Detail satu aparatur |
| GET | `/organisasi/admin/all?tier=` | FR-ADM-02 | Semua data organisasi (admin), bisa filter `tier` |
| POST | `/organisasi/admin` | FR-ADM-02 | Buat data aparatur baru |
| PATCH | `/organisasi/admin/:id` | FR-ADM-02 | Ubah data aparatur |
| DELETE | `/organisasi/admin/:id` | FR-ADM-02 | Hapus data aparatur |

## Potensi Desa — *implementasi referensi lengkap*

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| GET | `/potensi?category=&highlightOnly=` | FR-PUB-03 | Publik, default hanya kategori Pertanian & Pariwisata |
| GET | `/potensi/:id` | FR-PUB-03 | Detail satu potensi |
| GET | `/potensi/admin/all` | FR-ADM-03 | Semua potensi termasuk nonaktif (admin) |
| POST | `/potensi/admin` | FR-ADM-03 | Buat potensi baru |
| PATCH | `/potensi/admin/:id` | FR-ADM-03 | Ubah potensi |
| DELETE | `/potensi/admin/:id` | FR-ADM-03 | Hapus potensi |
| GET | `/potensi/catalog` *(belum dibuat)* | Formulir A.3 | Generate & unduh katalog PDF/Docs otomatis — lihat catatan di bawah |

> **Catatan katalog PDF/Docs**: endpoint generate katalog belum di-scaffold
> di sini karena butuh keputusan library (mis. `pdf-lib`/`puppeteer` untuk
> PDF, `docx` untuk Word) dan template desain katalog dari tim desain.
> Service `potensi.service.ts` sudah menyediakan data yang dibutuhkan
> (`listPublicPotensi`) sebagai basis endpoint ini.

## Sejarah Desa

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| GET | `/sejarah/narasi` | FR-PUB-04 | Daftar narasi sejarah, urut `sortOrder` |
| GET | `/sejarah/milestone?year=` | FR-PUB-04 | Daftar milestone sejarah, bisa filter `year` |
| POST | `/sejarah/admin/narasi` | FR-ADM-04 | Buat narasi sejarah |
| PATCH | `/sejarah/admin/narasi/:id` | FR-ADM-04 | Ubah narasi sejarah |
| DELETE | `/sejarah/admin/narasi/:id` | FR-ADM-04 | Hapus narasi sejarah |
| POST | `/sejarah/admin/milestone` | FR-ADM-04 | Buat milestone sejarah |
| PATCH | `/sejarah/admin/milestone/:id` | FR-ADM-04 | Ubah milestone sejarah |
| DELETE | `/sejarah/admin/milestone/:id` | FR-ADM-04 | Hapus milestone sejarah |

## Demografi + Kependudukan

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| GET | `/demografi/ringkasan` | FR-PUB-05 | Ringkasan statistik demografi terbaru |
| GET | `/demografi/per-dusun?dataYear=` | FR-PUB-05 | Statistik per dusun, bisa filter `dataYear` |
| PATCH | `/demografi/admin/ringkasan` | FR-ADM-05 | Perbarui ringkasan demografi |
| POST | `/demografi/admin/dusun` | FR-ADM-05 | Tambah data dusun |
| PATCH | `/demografi/admin/dusun/:id` | FR-ADM-05 | Ubah data dusun |
| DELETE | `/demografi/admin/dusun/:id` | FR-ADM-05 | Hapus data dusun |

## Homepage / News

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| GET | `/news?category=&page=&limit=` | FR-PUB-01 | List berita publik terbit; mendukung pagination |
| GET | `/news/:slug` | FR-PUB-01 | Detail berita publik berdasarkan slug |
| GET | `/news/admin/all?category=` | FR-ADM-06 | List semua berita untuk admin |
| POST | `/news/admin` | FR-ADM-06 | Buat berita baru |
| PATCH | `/news/admin/:id` | FR-ADM-06 | Ubah berita |
| DELETE | `/news/admin/:id` | FR-ADM-06 | Hapus berita |
| GET | `/profile` *(belum dibuat)* | FR-PUB-01, Formulir B.1 | Data `VillageProfile` + `HeroSlide` untuk homepage |

## Media

| Method | Path | Terkait PRD | Keterangan |
|---|---|---|---|
| GET | `/media` | FR-ADM-07 | Daftar media (admin) |
| POST | `/media` (multipart, field `file`) | FR-ADM-07 | Upload gambar, validasi format & ukuran otomatis |
| DELETE 

## Utility

| Method | Path | Keterangan |
|---|---|---|
| GET | `/health` | Health check untuk load balancer / uptime monitor |
