-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_skillCategoryId_fkey";

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "skillCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
