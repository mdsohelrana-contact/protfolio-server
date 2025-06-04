/*
  Warnings:

  - The `imageUrl` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `technology` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Technology" AS ENUM ('HTML', 'CSS', 'Tailwind', 'JavaScript', 'TypeScript', 'React', 'NextJS', 'Redux', 'Zustand', 'NodeJS', 'Express', 'NestJS', 'JWT', 'OAuth', 'Bcrypt', 'Zod', 'MongoDB', 'Mongoose', 'PostgreSQL', 'Prisma', 'ShadcnUI', 'FramerMotion', 'AOS', 'Git', 'GitHub', 'VSCode', 'Postman', 'Docker', 'Vercel', 'Netlify', 'Render', 'Railway', 'Firebase', 'AWS', 'Jest', 'ReactTestingLibrary', 'WebSockets', 'SocketIO', 'RESTAPI', 'GraphQL');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "technology" "Technology" NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];
