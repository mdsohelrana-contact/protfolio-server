/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[];

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
