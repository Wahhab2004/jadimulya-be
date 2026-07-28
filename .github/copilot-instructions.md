# Instruksi untuk GitHub Copilot — Backend Website Desa Jadimulya

Copilot Chat di VS Code membaca file ini secara otomatis untuk setiap request
di repo ini. Tujuannya: menjaga agar semua kode yang disarankan Copilot
konsisten dengan arsitektur dan konvensi tim, bukan gaya generik.

## Konteks Proyek

Backend untuk website informasi Desa Jadimulya + CMS admin. Lihat
`docs/STRATEGY.md` untuk arsitektur lengkap dan `docs/API_ENDPOINTS.md`
untuk daftar endpoint. Referensi kebutuhan produk ada di `docs/PRD-ringkasan.md`.

## Stack

- Node.js + TypeScript (strict mode)
- Express.js 4
- PostgreSQL + Prisma ORM
- Validasi input: Zod
- Auth: JWT (access + refresh token), bcrypt untuk hashing password
- Testing: Jest + Supertest

## Struktur Modul — WAJIB DIIKUTI

Setiap fitur adalah sebuah **modul mandiri** di `src/modules/<nama-modul>/`,
berisi 4 file dengan tanggung jawab terpisah:

- `*.routes.ts` — definisi route Express saja, tidak ada logika.
- `*.controller.ts` — terima request, panggil service, kirim response.
  Tidak boleh ada query Prisma langsung di sini.
- `*.service.ts` — seluruh business logic dan query Prisma ada di sini.
- `*.schema.ts` — skema validasi Zod untuk body/query/params modul ini.

Saat Copilot diminta membuat fitur baru, **ikuti pola dari modul `auth`**
sebagai referensi utama karena sudah lengkap dan mengikuti pola ini.

## Konvensi Kode

- Semua async controller **wajib** dibungkus `asyncHandler` (lihat
  `src/common/asyncHandler.ts`) — jangan tulis try/catch manual di controller.
- Error dilempar sebagai `ApiError` (`src/common/ApiError.ts`), ditangani
  terpusat oleh `error.middleware.ts`. Jangan `res.status().json()` untuk error.
- Response sukses selalu pakai helper `ApiResponse` (`src/common/ApiResponse.ts`)
  agar bentuk JSON konsisten: `{ success, data, message }`.
- Query database HANYA lewat Prisma Client (`src/config/prisma.ts`), tidak ada
  raw SQL kecuali benar-benar diperlukan dan didokumentasikan alasannya.
- Nama file: `kebab-case.ts`. Nama class/interface: `PascalCase`. Nama
  variabel/fungsi: `camelCase`.
- Setiap endpoint publik (GET tanpa auth) tidak boleh mengembalikan field
  sensitif (passwordHash, dll) — gunakan Prisma `select`, bukan filter manual
  setelah query.
- Jangan menyimpan kolom NIP pada modul Organisasi — sudah diputuskan dihapus
  dari scope produk.
- Endpoint CRUD admin selalu diproteksi middleware `auth.middleware.ts`
  (`requireAuth`).

## Pola Response API

```jsonc
// Sukses
{ "success": true, "data": { ... }, "message": "OK" }

// Error
{ "success": false, "message": "Pesan error yang jelas", "errors": [ ... ] }
```

## Yang TIDAK boleh disarankan Copilot

- Jangan generate migrasi Prisma manual di `prisma/migrations/` — selalu lewat
  `npm run prisma:migrate`.
- Jangan hardcode secret/API key di kode — selalu lewat `src/config/env.ts`
  yang membaca dari `.env`.
- Jangan menambah dependency baru tanpa disebutkan alasan singkatnya di PR.
- Jangan menulis fitur "Layanan Mandiri", "pengaduan warga online", atau
  "AI Assistant penulisan berita" di MVP — fitur-fitur ini masuk Next Phase
  sesuai PRD, hanya siapkan modul kosong bila diminta secara eksplisit.

## Saat Diminta Membuat Modul Baru

Urutan yang diharapkan saat prompting Copilot Chat ("/new" atau inline chat):

1. Tambahkan/perbarui model di `prisma/schema.prisma` dahulu.
2. Jalankan migrasi (manual oleh developer, bukan oleh Copilot).
3. Copilot generate `*.schema.ts` (Zod) berdasarkan model Prisma.
4. Copilot generate `*.service.ts` (fungsi CRUD memakai Prisma Client).
5. Copilot generate `*.controller.ts` (memanggil service, pakai asyncHandler).
6. Copilot generate `*.routes.ts` dan daftarkan di `src/routes/index.ts`.
7. Tambahkan test dasar di `tests/`.
