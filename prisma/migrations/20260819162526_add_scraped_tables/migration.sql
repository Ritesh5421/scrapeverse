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
    "label" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapedIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedRepo_fullName_key" ON "ScrapedRepo"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedIssue_repoId_label_key" ON "ScrapedIssue"("repoId", "label");

-- AddForeignKey
ALTER TABLE "ScrapedIssue" ADD CONSTRAINT "ScrapedIssue_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "ScrapedRepo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
