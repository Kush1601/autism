-- CreateIndex
CREATE INDEX "Child_userId_idx" ON "Child"("userId");

-- CreateIndex
CREATE INDEX "Screening_childId_idx" ON "Screening"("childId");

-- CreateIndex
CREATE INDEX "TherapyPlan_childId_idx" ON "TherapyPlan"("childId");

-- CreateIndex
CREATE INDEX "ProgressReport_childId_idx" ON "ProgressReport"("childId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- CreateIndex
CREATE INDEX "ChatMessage_childId_idx" ON "ChatMessage"("childId");
