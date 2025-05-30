/*
  Warnings:

  - You are about to drop the `testimonials` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "isPublish" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "keyAchievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "keyResponsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "technologies" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "challengesAndSolution" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "keyFeatures" TEXT[],
ADD COLUMN     "technicalDetails" TEXT;

-- DropTable
DROP TABLE "testimonials";
