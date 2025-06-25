/*
  Warnings:

  - The values [ADMIN,USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `challengesAndSolution` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `keyFeatures` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `technicalDetails` on the `projects` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'ABOUT', 'CONTACT');

-- CreateEnum
CREATE TYPE "SocialLinkTypes" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'WEBSITE');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('OWNER');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'OWNER';
COMMIT;

-- AlterTable
ALTER TABLE "aboutMe" ADD COLUMN     "address" TEXT DEFAULT 'Rajshahi, Bangladesh',
ADD COLUMN     "email" TEXT DEFAULT 'ranaot56@gmail.com',
ADD COLUMN     "phoneNumber" TEXT DEFAULT '+8801619830567',
ADD COLUMN     "section" "SectionType" NOT NULL DEFAULT 'HERO',
ADD COLUMN     "socialLinks" "SocialLinkTypes" NOT NULL DEFAULT 'GITHUB';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "challengesAndSolution",
DROP COLUMN "keyFeatures",
DROP COLUMN "technicalDetails",
ADD COLUMN     "projectContent" TEXT,
ALTER COLUMN "category" SET DEFAULT 'FULLSTACK';
