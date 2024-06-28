-- CreateTable
CREATE TABLE "User" (
    "userKey" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
