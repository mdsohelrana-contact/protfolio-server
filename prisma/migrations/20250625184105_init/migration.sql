-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('FULLSTACK', 'FRONTEND', 'BACKEND', 'LANDING_PAGE', 'API');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER');

-- CreateEnum
CREATE TYPE "Technology" AS ENUM ('HTML', 'CSS', 'Tailwind', 'JavaScript', 'TypeScript', 'React', 'NextJS', 'Redux', 'Zustand', 'NodeJS', 'Express', 'NestJS', 'JWT', 'OAuth', 'Bcrypt', 'Zod', 'MongoDB', 'Mongoose', 'PostgreSQL', 'Prisma', 'ShadcnUI', 'FramerMotion', 'AOS', 'Git', 'GitHub', 'VSCode', 'Postman', 'Docker', 'Vercel', 'Netlify', 'Render', 'Railway', 'Firebase', 'AWS', 'Jest', 'ReactTestingLibrary', 'WebSockets', 'SocketIO', 'RESTAPI', 'GraphQL');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'ABOUT', 'CONTACT');

-- CreateEnum
CREATE TYPE "SocialLinkTypes" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'WEBSITE', 'RESUME');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "category" "ProjectCategory" NOT NULL DEFAULT 'FULLSTACK',
    "demoUrl" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "projectContent" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skillCategories" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT NOT NULL,

    CONSTRAINT "skillCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skillCategoryId" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublish" BOOLEAN NOT NULL DEFAULT false,
    "technology" "Technology" NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "imageUrls" TEXT[],

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aboutMe" (
    "id" TEXT NOT NULL,
    "section" "SectionType" NOT NULL DEFAULT 'HERO',
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aboutMe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "keyAchievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keyResponsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactInfo" (
    "id" TEXT NOT NULL,
    "profileImage" TEXT,
    "socialLinks" "SocialLinkTypes" NOT NULL DEFAULT 'GITHUB',
    "resumeLink" TEXT,
    "address" TEXT DEFAULT 'Rajshahi, Bangladesh',
    "phoneNumber" TEXT DEFAULT '+8801619830567',
    "email" TEXT DEFAULT 'ranaot56@gmail.com',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactMessages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_demoUrl_key" ON "projects"("demoUrl");

-- CreateIndex
CREATE UNIQUE INDEX "projects_githubUrl_key" ON "projects"("githubUrl");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "skillCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
