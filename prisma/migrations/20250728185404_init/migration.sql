-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('FULLSTACK', 'FRONTEND', 'BACKEND', 'LANDING_PAGE', 'API');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER');

-- CreateEnum
CREATE TYPE "Technology" AS ENUM ('HTML', 'CSS', 'Tailwind', 'JavaScript', 'TypeScript', 'React', 'NextJS', 'Redux', 'Zustand', 'NodeJS', 'Express', 'NestJS', 'JWT', 'OAuth', 'Bcrypt', 'Zod', 'MongoDB', 'Mongoose', 'PostgreSQL', 'Prisma', 'ShadcnUI', 'FramerMotion', 'AOS', 'Git', 'GitHub', 'VSCode', 'Postman', 'Docker', 'Vercel', 'Netlify', 'Render', 'Railway', 'Firebase', 'AWS', 'Jest', 'ReactTestingLibrary', 'WebSockets', 'SocketIO', 'RESTAPI', 'GraphQL');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'ABOUT', 'CONTACT');

-- CreateEnum
CREATE TYPE "SocialLinkTypes" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'WEBSITE', 'RESUME', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('Desktop', 'Mobile', 'Tablet', 'Unknown');

-- CreateEnum
CREATE TYPE "ClickType" AS ENUM ('view', 'live_demo', 'github', 'details');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('web_development', 'mobile_app', 'consulting', 'other');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('under_5k', 'fiveK_15K', 'fifteenK_30K', 'thirtyK_50K', 'fiftyK_plus', 'lets_discuss');

-- CreateEnum
CREATE TYPE "Timeline" AS ENUM ('asap', 'oneMonth', 'twoToThreeMonths', 'threeToSixMonths', 'flexible');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('google', 'linkedin', 'github', 'referral', 'other');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('email', 'phone', 'both');

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
CREATE TABLE "about_me" (
    "id" TEXT NOT NULL,
    "section" "SectionType" NOT NULL DEFAULT 'HERO',
    "title" TEXT,
    "subTitle" TEXT,
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_me_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "profileImage" TEXT,
    "resumeLink" TEXT,
    "email" TEXT DEFAULT 'ranaot56@gmail.com',
    "phoneNumber" TEXT DEFAULT '+8801619830567',
    "address" TEXT DEFAULT 'Rajshahi, Bangladesh',
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "type" "SocialLinkTypes" NOT NULL,
    "url" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactMessages" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectContactForms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "position" TEXT,
    "projectType" "ProjectType" NOT NULL,
    "budget" "BudgetRange" NOT NULL,
    "timeline" "Timeline" NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "PriorityLevel" NOT NULL,
    "referralSource" "ReferralSource" NOT NULL,
    "newsletter" BOOLEAN NOT NULL,
    "terms" BOOLEAN NOT NULL,
    "projectDetails" TEXT,
    "preferredContact" "ContactMethod" NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectContactForms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL DEFAULT 'Unknown',
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "visitTime" TIMESTAMP(3) NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "pagesVisited" TEXT[],
    "clickedLinks" TEXT[],
    "referrer" TEXT NOT NULL,
    "isReturning" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectClick" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "clickType" "ClickType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "timeSpentOnProject" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_demoUrl_key" ON "projects"("demoUrl");

-- CreateIndex
CREATE UNIQUE INDEX "projects_githubUrl_key" ON "projects"("githubUrl");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_contactId_type_key" ON "social_links"("contactId", "type");

-- CreateIndex
CREATE INDEX "projectContactForms_email_idx" ON "projectContactForms"("email");

-- CreateIndex
CREATE INDEX "projectContactForms_phone_idx" ON "projectContactForms"("phone");

-- CreateIndex
CREATE INDEX "visitors_ipAddress_idx" ON "visitors"("ipAddress");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "skillCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectClick" ADD CONSTRAINT "ProjectClick_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
