-- CreateTable
CREATE TABLE "JWTBlacklist" (
    "jwt" TEXT NOT NULL,

    CONSTRAINT "JWTBlacklist_pkey" PRIMARY KEY ("jwt")
);

-- CreateIndex
CREATE UNIQUE INDEX "JWTBlacklist_jwt_key" ON "JWTBlacklist"("jwt");
