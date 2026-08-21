-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT NOT NULL DEFAULT '[]',
    "experienceLevel" TEXT,
    "goals" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "customLanguages" TEXT NOT NULL DEFAULT '[]',
    "timeCommitment" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapedRepo" (
    "id" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT NOT NULL DEFAULT '[]',
    "license" TEXT,
    "defaultBranch" TEXT,
    "pushedAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapedRepo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapedIssue" (
    "id" SERIAL NOT NULL,
    "repoId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "labels" TEXT NOT NULL DEFAULT '[]',
    "comments" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT,
    "createdAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapedIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapedReadme" (
    "id" SERIAL NOT NULL,
    "repoId" INTEGER NOT NULL,
    "rawContent" TEXT NOT NULL,
    "hasContributionGuide" BOOLEAN NOT NULL DEFAULT false,
    "setupComplexity" TEXT NOT NULL DEFAULT 'unknown',
    "techStack" TEXT NOT NULL DEFAULT '[]',
    "architectureKeywords" TEXT NOT NULL DEFAULT '[]',
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapedReadme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedRepo_fullName_key" ON "ScrapedRepo"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedIssue_repoId_number_key" ON "ScrapedIssue"("repoId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedReadme_repoId_key" ON "ScrapedReadme"("repoId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapedIssue" ADD CONSTRAINT "ScrapedIssue_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "ScrapedRepo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapedReadme" ADD CONSTRAINT "ScrapedReadme_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "ScrapedRepo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
