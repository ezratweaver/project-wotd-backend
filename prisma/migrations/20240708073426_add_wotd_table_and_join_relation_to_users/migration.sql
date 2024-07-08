-- CreateTable
CREATE TABLE "User_Learned" (
    "userLearnedKey" SERIAL NOT NULL,
    "wotdKey" INTEGER NOT NULL,
    "userKey" INTEGER NOT NULL,

    CONSTRAINT "User_Learned_pkey" PRIMARY KEY ("userLearnedKey")
);

-- CreateTable
CREATE TABLE "WOTD" (
    "wotdKey" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WOTD_pkey" PRIMARY KEY ("wotdKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "WOTD_word_key" ON "WOTD"("word");

-- AddForeignKey
ALTER TABLE "User_Learned" ADD CONSTRAINT "User_Learned_userKey_fkey" FOREIGN KEY ("userKey") REFERENCES "User"("userKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Learned" ADD CONSTRAINT "User_Learned_wotdKey_fkey" FOREIGN KEY ("wotdKey") REFERENCES "WOTD"("wotdKey") ON DELETE RESTRICT ON UPDATE CASCADE;
