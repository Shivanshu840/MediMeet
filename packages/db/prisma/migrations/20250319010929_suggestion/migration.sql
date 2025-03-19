-- CreateTable
CREATE TABLE "HealthSuggestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HealthSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthSuggestion_userId_idx" ON "HealthSuggestion"("userId");
