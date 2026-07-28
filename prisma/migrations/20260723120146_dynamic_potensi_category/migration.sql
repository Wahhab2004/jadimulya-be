/*
  Warnings:

  - You are about to drop the column `category` on the `potentials` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `potentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "potentials" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PotentialCategory";

-- CreateTable
CREATE TABLE "potential_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "potential_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "potential_categories_name_key" ON "potential_categories"("name");

-- AddForeignKey
ALTER TABLE "potentials" ADD CONSTRAINT "potentials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "potential_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
