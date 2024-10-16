/*
  Warnings:

  - Added the required column `pronunciationSound` to the `WordOfTheDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WordOfTheDay" ADD COLUMN     "pronunciationSound" BYTEA NOT NULL;
