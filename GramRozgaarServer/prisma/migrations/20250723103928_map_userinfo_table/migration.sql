/*
  Warnings:

  - You are about to drop the column `isAvailableForWork` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isMachineAvailable` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `languagePreference` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `machineType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAvailableForWork",
DROP COLUMN "isMachineAvailable",
DROP COLUMN "languagePreference",
DROP COLUMN "machineType",
DROP COLUMN "workType";

-- CreateTable
CREATE TABLE "userinfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "workType" TEXT NOT NULL,
    "isAvailableForWork" BOOLEAN NOT NULL,
    "isMachineAvailable" BOOLEAN NOT NULL,
    "machineType" TEXT,
    "machineImages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machineAlreadySet" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "userinfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userinfo_userId_key" ON "userinfo"("userId");

-- AddForeignKey
ALTER TABLE "userinfo" ADD CONSTRAINT "userinfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
