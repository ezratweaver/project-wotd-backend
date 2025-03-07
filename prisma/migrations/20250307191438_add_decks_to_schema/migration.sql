/*
  Warnings:

  - A unique constraint covering the columns `[userKey,wotdKey]` on the table `UserLearned` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Deck" (
    "deckKey" SERIAL NOT NULL,
    "userKey" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("deckKey")
);

-- CreateTable
CREATE TABLE "DeckWord" (
    "deckWordKey" SERIAL NOT NULL,
    "deckKey" INTEGER NOT NULL,
    "wotdKey" INTEGER NOT NULL,

    CONSTRAINT "DeckWord_pkey" PRIMARY KEY ("deckWordKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeckWord_deckKey_wotdKey_key" ON "DeckWord"("deckKey", "wotdKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserLearned_userKey_wotdKey_key" ON "UserLearned"("userKey", "wotdKey");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userKey_fkey" FOREIGN KEY ("userKey") REFERENCES "User"("userKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckWord" ADD CONSTRAINT "DeckWord_deckKey_fkey" FOREIGN KEY ("deckKey") REFERENCES "Deck"("deckKey") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckWord" ADD CONSTRAINT "DeckWord_wotdKey_fkey" FOREIGN KEY ("wotdKey") REFERENCES "WordOfTheDay"("wotdKey") ON DELETE RESTRICT ON UPDATE CASCADE;
