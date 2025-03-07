/*
  Warnings:

  - You are about to alter the column `name` on the `Deck` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[userKey,name]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deck" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Deck_userKey_name_key" ON "Deck"("userKey", "name");
