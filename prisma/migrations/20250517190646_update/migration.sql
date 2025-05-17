/*
  Warnings:

  - A unique constraint covering the columns `[demoUrl]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubUrl]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "projects_demoUrl_key" ON "projects"("demoUrl");

-- CreateIndex
CREATE UNIQUE INDEX "projects_githubUrl_key" ON "projects"("githubUrl");
