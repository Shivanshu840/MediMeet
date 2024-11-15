/*
  Warnings:

  - You are about to drop the column `allergies` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `bloodOxygen` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `bmi` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `chronicConditions` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `lastCheckup` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `nextCheckup` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Health` table. All the data in the column will be lost.
  - You are about to drop the column `sleepHours` on the `Health` table. All the data in the column will be lost.
  - The `bloodPressure` column on the `Health` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `datedAt` to the `Health` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Health" DROP COLUMN "allergies",
DROP COLUMN "bloodOxygen",
DROP COLUMN "bmi",
DROP COLUMN "chronicConditions",
DROP COLUMN "height",
DROP COLUMN "lastCheckup",
DROP COLUMN "medications",
DROP COLUMN "nextCheckup",
DROP COLUMN "notes",
DROP COLUMN "sleepHours",
ADD COLUMN     "airQuality" JSONB,
ADD COLUMN     "datedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "foodCalories" INTEGER,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sleepTime" DOUBLE PRECISION,
ADD COLUMN     "steps" INTEGER,
ADD COLUMN     "temperature" DOUBLE PRECISION,
DROP COLUMN "bloodPressure",
ADD COLUMN     "bloodPressure" JSONB;
