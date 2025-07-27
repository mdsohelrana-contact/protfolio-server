-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('Desktop', 'Mobile', 'Tablet');

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
CREATE TABLE "ProjectContactForm" (
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

    CONSTRAINT "ProjectContactForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "visitTime" TIMESTAMP(3) NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "pagesVisited" TEXT[],
    "clickedLinks" TEXT[],
    "referrer" TEXT NOT NULL,
    "isReturning" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "ProjectClick" ADD CONSTRAINT "ProjectClick_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
