-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "OfficialTier" AS ENUM ('KEPALA_DESA', 'SEKDES_BPD', 'STAFF');

-- CreateEnum
CREATE TYPE "PotentialCategory" AS ENUM ('PERTANIAN', 'PARIWISATA', 'UMKM');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('PEMBANGUNAN', 'KESEHATAN', 'PERTANIAN', 'WISATA', 'LAINNYA');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "village_profile" (
    "id" TEXT NOT NULL,
    "villageName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "regency" TEXT NOT NULL DEFAULT 'Pangandaran',
    "province" TEXT NOT NULL DEFAULT 'Jawa Barat',
    "officeAddress" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "areaSize" DECIMAL(10,2),
    "areaUnit" TEXT NOT NULL DEFAULT 'Ha',
    "elevationMdpl" DECIMAL(10,2),
    "borderNorth" TEXT,
    "borderSouth" TEXT,
    "borderEast" TEXT,
    "borderWest" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "slogan" TEXT NOT NULL DEFAULT 'Desa Jadimulya anu lewih waluya',
    "logoRegencyUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "village_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officials" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "division" TEXT,
    "tier" "OfficialTier" NOT NULL DEFAULT 'STAFF',
    "photoUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "facebookUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "officials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "potentials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "PotentialCategory" NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "fullDesc" TEXT,
    "coverImage" TEXT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "potentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "potential_images" (
    "id" TEXT NOT NULL,
    "potentialId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "potential_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_narratives" (
    "id" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_narratives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_milestones" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographic_summary" (
    "id" TEXT NOT NULL,
    "totalPopulation" INTEGER NOT NULL,
    "totalFamilies" INTEGER NOT NULL,
    "maleCount" INTEGER NOT NULL,
    "femaleCount" INTEGER NOT NULL,
    "dataYear" INTEGER NOT NULL,
    "farmerCount" INTEGER NOT NULL DEFAULT 0,
    "traderCount" INTEGER NOT NULL DEFAULT 0,
    "civilServant" INTEGER NOT NULL DEFAULT 0,
    "laborerCount" INTEGER NOT NULL DEFAULT 0,
    "otherJobCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demographic_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dusun_stats" (
    "id" TEXT NOT NULL,
    "dusunName" TEXT NOT NULL,
    "totalKK" INTEGER NOT NULL,
    "maleCount" INTEGER NOT NULL,
    "femaleCount" INTEGER NOT NULL,
    "dataYear" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dusun_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dusun_stats_dusunName_dataYear_key" ON "dusun_stats"("dusunName", "dataYear");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- AddForeignKey
ALTER TABLE "potential_images" ADD CONSTRAINT "potential_images_potentialId_fkey" FOREIGN KEY ("potentialId") REFERENCES "potentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
