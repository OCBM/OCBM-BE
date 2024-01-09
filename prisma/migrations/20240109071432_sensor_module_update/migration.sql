/*
  Warnings:

  - Made the column `sensorDescription` on table `Sensor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Sensor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageName` on table `Sensor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageKey` on table `Sensor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sensor" ALTER COLUMN "sensorDescription" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "imageName" SET NOT NULL,
ALTER COLUMN "imageKey" SET NOT NULL;
