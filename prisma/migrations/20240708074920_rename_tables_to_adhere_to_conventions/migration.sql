/*
  Warnings:

  - You are about to drop the `User_Learned` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WOTD` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User_Learned" DROP CONSTRAINT "User_Learned_userKey_fkey";

-- DropForeignKey
ALTER TABLE "User_Learned" DROP CONSTRAINT "User_Learned_wotdKey_fkey";

-- DropTable
DROP TABLE "User_Learned";

-- DropTable
DROP TABLE "WOTD";

-- CreateTable
CREATE TABLE "UserLearned" (
    "userLearnedKey" SERIAL NOT NULL,
    "wotdKey" INTEGER NOT NULL,
    "userKey" INTEGER NOT NULL,

    CONSTRAINT "UserLearned_pkey" PRIMARY KEY ("userLearnedKey")
);

-- CreateTable
CREATE TABLE "WordOfTheDay" (
    "wotdKey" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordOfTheDay_pkey" PRIMARY KEY ("wotdKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordOfTheDay_word_key" ON "WordOfTheDay"("word");

-- AddForeignKey
ALTER TABLE "UserLearned" ADD CONSTRAINT "UserLearned_userKey_fkey" FOREIGN KEY ("userKey") REFERENCES "User"("userKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearned" ADD CONSTRAINT "UserLearned_wotdKey_fkey" FOREIGN KEY ("wotdKey") REFERENCES "WordOfTheDay"("wotdKey") ON DELETE RESTRICT ON UPDATE CASCADE;
