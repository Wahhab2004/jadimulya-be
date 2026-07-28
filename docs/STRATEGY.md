# Strategi Pengembangan Backend — Website Desa Jadimulya

Stack: **Express.js + TypeScript + PostgreSQL + Prisma ORM**
Tools: **VS Code + GitHub Copilot**
Acuan: PRD Jadimulya V3

---

## 1. Prinsip Arsitektur

Backend disusun sebagai **modular monolith** — satu aplikasi Express, tapi
kode dipecah per-fitur (`src/modules/<fitur>/`), bukan per-jenis-file
(`controllers/`, `services/` global). Alasan memilih ini untuk proyek desa:

- **Scalable secukupnya, tidak overengineered.** Microservices tidak
  dibutuhkan untuk beban trafik website desa; modular monolith memberi
  batas yang jelas antar fitur tanpa kompleksitas operasional
  (service discovery, network latency, dsb).
- **Mudah dipecah nanti.** Kalau suatu saat modul tertentu (mis. Media/CMS)
  perlu di-scale terpisah, strukturnya sudah siap diekstrak jadi service
  sendiri karena tidak ada dependency silang antar modul di level import.
- **Cocok untuk kerja dengan Copilot.** Setiap modul punya 4 file dengan
  pola identik (`routes → controller → service → schema`), sehingga Copilot
  cepat "belajar" pola dari 1-2 modul referensi dan mereplikasinya secara
  konsisten ke modul lain.

### Alur request

```
Client → Express Router → validate (Zod) → Controller → Service → Prisma → PostgreSQL
                                                 ↓
                                           ApiError / sendSuccess
```

Aturan tegas:
- **Controller tidak boleh memanggil Prisma langsung.** Semua akses DB lewat
  `*.service.ts`. ini menjaga business logic tetap testable tanpa mem-mock
  Express request/response.
- **Validasi input terjadi sebelum controller**, lewat middleware `validate()`
  + skema Zod per modul. Data yang sampai ke controller sudah pasti valid.
- **Satu bentuk error, satu bentuk response sukses** di seluruh API
  (lihat `src/common/ApiError.ts` & `ApiResponse.ts`), supaya frontend
  (Next.js) bisa menangani response secara generik.

---

## 2. Struktur Folder

```
backend-jadimulya/
├── .github/
│   └── copilot-instructions.md   # instruksi otomatis untuk Copilot Chat
├── docs/
│   ├── STRATEGY.md                # dokumen ini
│   ├── API_ENDPOINTS.md           # daftar endpoint vs FR di PRD
│   └── PRD-ringkasan.md
├── prisma/
│   ├── schema.prisma               # single source of truth struktur data
│   ├── seed.ts                     # data awal untuk development
│   └── migrations/                 # auto-generated, jangan diedit manual
├── src/
│   ├── config/                     # env, prisma client singleton
│   ├── common/                     # ApiError, ApiResponse, asyncHandler
│   ├── middlewares/                # auth, validate, upload, error handler
│   ├── modules/
│   │   ├── auth/                   # pola referensi utama
│   │   ├── organisasi/             # SOTK — FR-PUB-02, FR-ADM-02
│   │   ├── potensi/                # pola referensi CRUD publik+admin
│   │   ├── sejarah/                # FR-PUB-04, FR-ADM-04
│   │   ├── demografi/              # FR-PUB-05, FR-ADM-05
│   │   ├── news/                   # FR-ADM-06
│   │   └── media/                  # FR-ADM-07, upload
│   ├── routes/index.ts             # menggabungkan semua router modul
│   ├── app.ts                      # konfigurasi Express (middleware global)
│   └── server.ts                   # entrypoint, listen + graceful shutdown
├── tests/
├── docker-compose.yml               # PostgreSQL + Adminer lokal
├── .env.example
└── package.json
```

Setiap modul baru **wajib** mengikuti 4 file yang sama (`routes`,
`controller`, `service`, `schema`) — lihat modul `potensi` sebagai contoh
CRUD publik + admin yang lengkap, dan modul `auth` untuk pola login/JWT.

---

## 3. Strategi Skema Database (Prisma)

`prisma/schema.prisma` sudah memodelkan seluruh entitas dari PRD V3:
`AdminUser`, `VillageProfile`, `HeroSlide`, `Official` (SOTK), `Potential`
(+kategori `PERTANIAN`/`PARIWISATA`/`UMKM`), `HistoryNarrative` +
`HistoryMilestone`, `DemographicSummary` + `DusunStat` (per dusun),
`News`, `Media`.

Keputusan desain penting:

- **Enum `PotentialCategory` sudah menyertakan `UMKM`** meski di MVP hanya
  `PERTANIAN` dan `PARIWISATA` yang tampil publik. Ini supaya saat UMKM
  dibuka di Next Phase, tidak perlu migrasi skema — cukup ubah filter di
  service layer (`potensi.service.ts`, lihat konstanta
  `MVP_ACTIVE_CATEGORIES`).
- **Tidak ada kolom NIP** pada model `Official` — sudah diputuskan dihapus
  dari scope produk (rapat 16/07).
- **`HistoryNarrative` disimpan per-section dengan `sortOrder`**, bukan satu
  blok teks besar, supaya endpoint publik bisa membentuk daftar isi (TOC)
  interaktif tanpa parsing HTML di frontend.
- **`DusunStat` punya `@@unique([dusunName, dataYear])`** agar admin tidak
  bisa tidak sengaja membuat data duplikat untuk dusun & tahun yang sama.
- **UUID sebagai primary key** (bukan auto-increment integer) — lebih aman
  untuk endpoint publik (ID tidak bisa ditebak/di-enumerasi).

### Alur migrasi

```bash
# setelah mengubah schema.prisma
npm run prisma:migrate      # buat + jalankan migrasi baru (development)
npm run prisma:generate     # regenerate Prisma Client (biasanya otomatis)
npm run prisma:migrate:deploy  # dipakai di CI/CD untuk staging/production
```

Migrasi **tidak pernah** ditulis manual — selalu lewat `prisma migrate dev`
agar riwayat migrasi konsisten dan bisa direplay di environment lain.

---

## 4. Strategi Auth & Keamanan

- **JWT access token (15 menit) + refresh token (7 hari)**, bukan session
  cookie server-side — memudahkan skalabilitas horizontal (server tidak
  perlu menyimpan state), cocok untuk deploy di platform PaaS sederhana.
- Password di-hash dengan **bcrypt** (`saltRounds` default library, cukup
  untuk skala pengguna admin desa yang kecil).
- `helmet` untuk header keamanan dasar, `express-rate-limit` untuk mencegah
  brute-force login, `cors` dibatasi ke origin frontend saja.
- MVP sengaja **hanya satu role (`ADMIN`)** sesuai PRD (multi-role masuk
  Future) — tapi `AdminRole` sudah berbentuk enum dan middleware
  `requireRole()` sudah disiapkan supaya penambahan role nanti tidak perlu
  refactor besar.

---

## 5. Strategi Validasi & Error Handling

- **Zod** dipakai untuk validasi input di boundary (body/query/params),
  bukan di service layer — service layer mengasumsikan input sudah bersih.
- Semua error terduga dilempar sebagai `ApiError` dengan status code
  eksplisit (`ApiError.notFound()`, `.badRequest()`, dst), ditangkap oleh
  satu `error.middleware.ts` di paling akhir chain middleware.
- Error tak terduga (bug, exception library) tetap ditangkap generic
  handler dan dikembalikan sebagai 500 tanpa membocorkan stack trace di
  production (`NODE_ENV=production`).

---

## 6. Strategi Scalability

Untuk kebutuhan saat ini (website desa, trafik rendah-menengah), fokus
scalability bukan pada horizontal scaling arsitektur, tapi pada
**kemudahan berkembang tanpa refactor besar**:

| Area | Strategi |
|---|---|
| Kode | Modular per-fitur, bukan per-layer — menambah fitur baru tidak menyentuh fitur lama. |
| Database | Index otomatis dari Prisma pada `@id`/`@unique`; tambahkan `@@index` di kolom yang sering difilter (mis. `News.category`, `Potential.category`) begitu data mulai besar. |
| Read-heavy content publik | Endpoint publik (homepage, potensi, statistik) murni GET — siap ditambah caching (mis. `Cache-Control` header atau Redis) tanpa mengubah kontrak API. |
| Upload media | Disimpan sebagai file di disk + path di DB untuk MVP; struktur `media.service` sudah terpisah sehingga gampang diganti ke object storage (S3-compatible) nanti tanpa mengubah modul lain. |
| Deployment | Stateless process (JWT, bukan session in-memory) — bisa dijalankan multi-instance di belakang load balancer kapan pun diperlukan. |
| Multi-role & approval workflow (Future) | Skema `AdminRole` enum & `requireRole()` middleware sudah disiapkan sejak awal. |

---

## 7. Alur Kerja VS Code + GitHub Copilot

### Setup satu kali
1. Install ekstensi **GitHub Copilot** dan **GitHub Copilot Chat** di VS Code.
2. Install ekstensi **Prisma** (syntax highlight + format `schema.prisma`).
3. Buka folder project di VS Code — file `.github/copilot-instructions.md`
   otomatis terbaca oleh Copilot Chat untuk seluruh request di repo ini,
   tanpa perlu di-paste ulang setiap kali.
4. Jalankan `docker compose up -d` untuk PostgreSQL lokal, lalu
   `npm install && npm run prisma:migrate && npm run prisma:seed`.

### Pola kerja menambah modul baru (mis. `sejarah`)
1. **Manusia**: tambah/cek model terkait di `prisma/schema.prisma`.
2. **Manusia**: jalankan `npm run prisma:migrate` (Copilot tidak menjalankan
   migrasi — ini keputusan yang harus disengaja).
3. **Copilot Chat** (`Ctrl+I` / panel Chat), prompt contoh:
   > "Buatkan sejarah.schema.ts, sejarah.service.ts, dan sejarah.controller.ts
   > mengikuti pola modul potensi, untuk model HistoryNarrative dan
   > HistoryMilestone di schema.prisma. Endpoint publik: GET list narasi
   > terurut + GET list milestone terurut. Endpoint admin: CRUD milestone
   > dan update narasi, dilindungi requireAuth."
4. Review hasil Copilot — cek konsistensi dengan `ApiError`/`sendSuccess`,
   cek tidak ada query Prisma di controller.
5. Lengkapi route di `sejarah.routes.ts` (ganti stub), daftarkan tidak perlu
   diubah karena sudah terdaftar di `src/routes/index.ts`.
6. Tambah test dasar di `tests/sejarah.test.ts` mengikuti pola
   `tests/health.test.ts`.

### Tips prompting Copilot yang efektif untuk repo ini
- Selalu sebut nama modul referensi ("...mengikuti pola modul potensi...")
  — Copilot jauh lebih konsisten kalau diberi contoh konkret dari repo,
  bukan hanya deskripsi abstrak.
- Untuk perubahan skema, minta Copilot Chat **menjelaskan dampak migrasi**
  dulu sebelum generate migration message, karena Prisma migration adalah
  operasi yang mengubah data production.
- Gunakan **inline chat di dalam file** (`Ctrl+I`) untuk perubahan kecil
  (nambah field validasi, ubah pesan error), dan **panel Chat** untuk
  membuat file/modul baru dari nol.
- Untuk review sebelum PR, minta: "Cek file ini terhadap aturan di
  .github/copilot-instructions.md, ada yang dilanggar?"

---

## 8. Git & Environment Workflow

- **Branching**: `main` (production-ready) ← `develop` (integrasi) ←
  `feature/<nama-modul>` per fitur. Untuk tim kecil, `main` + `feature/*`
  langsung juga cukup — sesuaikan dengan jumlah developer.
- **Environment terpisah**: `.env` lokal (tidak commit), `.env.staging`,
  `.env.production` dikelola lewat secret manager platform hosting
  (bukan file di repo).
- **Sebelum push**: `npm run lint && npm run test` — pertimbangkan
  menambahkan Husky pre-commit hook kalau tim sudah lebih dari 1 orang.
- **CI minimal yang disarankan** (GitHub Actions): jalankan
  `prisma migrate deploy` ke DB test + `npm test` di setiap PR ke `develop`.

---

## 9. Urutan Implementasi yang Disarankan (selaras MVP 2–4 minggu di PRD)

| Minggu | Fokus Backend |
|---|---|
| 1 | Setup project (selesai lewat scaffold ini), modul `auth`, `media` upload, migrasi awal seluruh skema. |
| 2 | Modul `organisasi`, `potensi`, `demografi` (termasuk per-dusun) — CRUD admin + endpoint publik. |
| 3 | Modul `sejarah` (CMS-editable), `news` + kategori; mulai integrasi dengan frontend Next.js. |
| 4 (opsional) | Hardening: rate limit tuning, index database, caching endpoint publik, QA end-to-end. |

---

## 10. Yang Sengaja Belum Dibangun (selaras Out-of-Scope PRD)

Jangan implementasikan di MVP kecuali ada instruksi eksplisit:
- Layanan Mandiri (surat online), sistem pengaduan warga — Next Phase.
- AI Assistant penulisan berita — Next Phase.
- Multi-role permission granular, workflow approval berlapis — Future.
- Kategori Potensi `UMKM` tampil di publik — Next Phase (skema sudah siap).

Skema database sengaja sudah mengakomodasi beberapa hal ini (enum, kolom
opsional) supaya saat waktunya tiba, perubahan cukup di level service/route,
tanpa migrasi skema besar yang berisiko terhadap data produksi.
