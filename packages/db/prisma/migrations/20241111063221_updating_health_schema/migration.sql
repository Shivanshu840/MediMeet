-- CreateTable
CREATE TABLE "Health" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "heartRate" INTEGER,
    "bloodPressure" TEXT,
    "bloodOxygen" DOUBLE PRECISION,
    "sleepHours" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "allergies" TEXT,
    "medications" TEXT,
    "chronicConditions" TEXT,
    "lastCheckup" TIMESTAMP(3),
    "nextCheckup" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Health_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Health_userId_key" ON "Health"("userId");

-- AddForeignKey
ALTER TABLE "Health" ADD CONSTRAINT "Health_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
