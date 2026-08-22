-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "ethnicity" TEXT,
    "bornWithJaundice" BOOLEAN NOT NULL DEFAULT false,
    "familyASDHistory" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "whoCompleting" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Screening" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "a1Score" INTEGER NOT NULL,
    "a2Score" INTEGER NOT NULL,
    "a3Score" INTEGER NOT NULL,
    "a4Score" INTEGER NOT NULL,
    "a5Score" INTEGER NOT NULL,
    "a6Score" INTEGER NOT NULL,
    "a7Score" INTEGER NOT NULL,
    "a8Score" INTEGER NOT NULL,
    "a9Score" INTEGER NOT NULL,
    "a10Score" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "aiPrediction" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Screening_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TherapyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "screeningId" TEXT,
    "therapyType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TherapyPlan_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TherapySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "therapyPlanId" TEXT NOT NULL,
    "sessionDate" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "notes" TEXT,
    "improvementScore" INTEGER,
    CONSTRAINT "TherapySession_therapyPlanId_fkey" FOREIGN KEY ("therapyPlanId") REFERENCES "TherapyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "reportDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallScore" REAL NOT NULL,
    "milestones" TEXT NOT NULL,
    "concerns" TEXT,
    CONSTRAINT "ProgressReport_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "childId" TEXT,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
