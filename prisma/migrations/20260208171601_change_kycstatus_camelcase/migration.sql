/*
  Warnings:

  - You are about to drop the column `kycstatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "kycstatus",
ADD COLUMN     "kycStatus" "KYCStatus" NOT NULL DEFAULT 'UNVERIFIED';
