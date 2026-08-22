-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Screening" (
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
    "mlModelUsed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Screening_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Screening" ("a10Score", "a1Score", "a2Score", "a3Score", "a4Score", "a5Score", "a6Score", "a7Score", "a8Score", "a9Score", "aiPrediction", "childId", "completedAt", "confidence", "id", "riskLevel", "totalScore") SELECT "a10Score", "a1Score", "a2Score", "a3Score", "a4Score", "a5Score", "a6Score", "a7Score", "a8Score", "a9Score", "aiPrediction", "childId", "completedAt", "confidence", "id", "riskLevel", "totalScore" FROM "Screening";
DROP TABLE "Screening";
ALTER TABLE "new_Screening" RENAME TO "Screening";
CREATE INDEX "Screening_childId_idx" ON "Screening"("childId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
