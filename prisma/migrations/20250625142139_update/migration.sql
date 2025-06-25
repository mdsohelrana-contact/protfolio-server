/*
  Warnings:

  - You are about to drop the column `address` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `resumeLink` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `aboutMe` table. All the data in the column will be lost.
  - You are about to drop the column `emailAddress` on the `contactInfo` table. All the data in the column will be lost.
  - You are about to drop the column `gitHubProfile` on the `contactInfo` table. All the data in the column will be lost.
  - You are about to drop the column `linkedInProfile` on the `contactInfo` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `contactInfo` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "SocialLinkTypes" ADD VALUE 'RESUME';

-- AlterTable
ALTER TABLE "aboutMe" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "phoneNumber",
DROP COLUMN "profileImage",
DROP COLUMN "resumeLink",
DROP COLUMN "socialLinks",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "contactInfo" DROP COLUMN "emailAddress",
DROP COLUMN "gitHubProfile",
DROP COLUMN "linkedInProfile",
DROP COLUMN "mobileNumber",
ADD COLUMN     "email" TEXT DEFAULT 'ranaot56@gmail.com',
ADD COLUMN     "phoneNumber" TEXT DEFAULT '+8801619830567',
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "socialLinks" "SocialLinkTypes" NOT NULL DEFAULT 'GITHUB',
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" SET DEFAULT 'Rajshahi, Bangladesh';
