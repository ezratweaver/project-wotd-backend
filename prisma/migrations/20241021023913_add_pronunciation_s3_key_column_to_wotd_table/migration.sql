/*
  Warnings:

  - A unique constraint covering the columns `[pronunciationS3Key]` on the table `WordOfTheDay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pronunciationS3Key` to the `WordOfTheDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WordOfTheDay" ADD COLUMN     "pronunciationS3Key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WordOfTheDay_pronunciationS3Key_key" ON "WordOfTheDay"("pronunciationS3Key");
