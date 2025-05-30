/*
  Warnings:

  - Added the required column `icon` to the `skillCategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "skillCategories" ADD COLUMN     "icon" TEXT NOT NULL;
