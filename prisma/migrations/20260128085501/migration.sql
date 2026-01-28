/*
  Warnings:

  - You are about to drop the column `breed` on the `Cat` table. All the data in the column will be lost.
  - Added the required column `breedId` to the `Cat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cat" DROP COLUMN "breed",
ADD COLUMN     "breedId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CatBreed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CatBreed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CatBreed_name_key" ON "CatBreed"("name");

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "CatBreed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
