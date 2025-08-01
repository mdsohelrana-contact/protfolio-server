-- CreateEnum
CREATE TYPE "public"."ProjectCategory" AS ENUM ('FULLSTACK', 'FRONTEND', 'BACKEND', 'LANDING_PAGE', 'API');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('OWNER');

-- CreateEnum
CREATE TYPE "public"."Technology" AS ENUM ('HTML', 'CSS', 'Tailwind', 'JavaScript', 'TypeScript', 'React', 'NextJS', 'Redux', 'Zustand', 'NodeJS', 'Express', 'NestJS', 'JWT', 'OAuth', 'Bcrypt', 'Zod', 'MongoDB', 'Mongoose', 'PostgreSQL', 'Prisma', 'ShadcnUI', 'FramerMotion', 'AOS', 'Git', 'GitHub', 'VSCode', 'Postman', 'Docker', 'Vercel', 'Netlify', 'Render', 'Railway', 'Firebase', 'AWS', 'Jest', 'ReactTestingLibrary', 'WebSockets', 'SocketIO', 'RESTAPI', 'GraphQL');

-- CreateEnum
CREATE TYPE "public"."SectionType" AS ENUM ('HERO', 'ABOUT', 'CONTACT', 'FOOTER');

-- CreateEnum
CREATE TYPE "public"."SocialLinkTypes" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'WEBSITE', 'RESUME', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."DeviceType" AS ENUM ('Desktop', 'Mobile', 'Tablet', 'Unknown');

-- CreateEnum
CREATE TYPE "public"."ClickType" AS ENUM ('view', 'live_demo', 'github', 'details');

-- CreateEnum
CREATE TYPE "public"."ProjectType" AS ENUM ('web_development', 'mobile_app', 'consulting', 'other');

-- CreateEnum
CREATE TYPE "public"."BudgetRange" AS ENUM ('under_5k', 'fiveK_15K', 'fifteenK_30K', 'thirtyK_50K', 'fiftyK_plus', 'lets_discuss');

-- CreateEnum
CREATE TYPE "public"."Timeline" AS ENUM ('asap', 'oneMonth', 'twoToThreeMonths', 'threeToSixMonths', 'flexible');

-- CreateEnum
CREATE TYPE "public"."PriorityLevel" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "public"."ReferralSource" AS ENUM ('google', 'linkedin', 'github', 'referral', 'other');

-- CreateEnum
CREATE TYPE "public"."ContactMethod" AS ENUM ('email', 'phone', 'both');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "tags" TEXT[],
    "category" "public"."ProjectCategory" NOT NULL DEFAULT 'FULLSTACK',
    "demoUrl" TEXT NOT NULL,
    "clientRepo" TEXT NOT NULL,
    "serverRepo" TEXT NOT NULL,
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
CREATE TABLE "public"."skillCategories" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT NOT NULL,

    CONSTRAINT "skillCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skillCategoryId" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blogs" (
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
    "technology" "public"."Technology" NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "imageUrls" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."about_me" (
    "id" TEXT NOT NULL,
    "section" "public"."SectionType" NOT NULL DEFAULT 'HERO',
    "title" TEXT,
    "subTitle" TEXT,
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_me_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experiences" (
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
CREATE TABLE "public"."contact_info" (
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
CREATE TABLE "public"."social_links" (
    "id" TEXT NOT NULL,
    "type" "public"."SocialLinkTypes" NOT NULL,
    "url" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contactMessages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projectContactForms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "position" TEXT,
    "projectType" "public"."ProjectType" NOT NULL,
    "budget" "public"."BudgetRange" NOT NULL,
    "timeline" "public"."Timeline" NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "public"."PriorityLevel" NOT NULL,
    "referralSource" "public"."ReferralSource" NOT NULL,
    "newsletter" BOOLEAN NOT NULL,
    "terms" BOOLEAN NOT NULL,
    "projectDetails" TEXT,
    "preferredContact" "public"."ContactMethod" NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projectContactForms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visitors" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "deviceType" "public"."DeviceType" NOT NULL DEFAULT 'Unknown',
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
CREATE TABLE "public"."ProjectClick" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "clickType" "public"."ClickType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "timeSpentOnProject" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_demoUrl_key" ON "public"."projects"("demoUrl");

-- CreateIndex
CREATE UNIQUE INDEX "projects_clientRepo_key" ON "public"."projects"("clientRepo");

-- CreateIndex
CREATE UNIQUE INDEX "projects_serverRepo_key" ON "public"."projects"("serverRepo");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "public"."blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_contactId_type_key" ON "public"."social_links"("contactId", "type");

-- CreateIndex
CREATE INDEX "projectContactForms_email_idx" ON "public"."projectContactForms"("email");

-- CreateIndex
CREATE INDEX "projectContactForms_phone_idx" ON "public"."projectContactForms"("phone");

-- CreateIndex
CREATE INDEX "visitors_ipAddress_idx" ON "public"."visitors"("ipAddress");

-- AddForeignKey
ALTER TABLE "public"."skills" ADD CONSTRAINT "skills_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "public"."skillCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_links" ADD CONSTRAINT "social_links_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contact_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectClick" ADD CONSTRAINT "ProjectClick_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "public"."visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
