/*
  Warnings:

  - A unique constraint covering the columns `[imageKey]` on the table `Element` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageKey]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageKey]` on the table `MachineLine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageKey]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageKey]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "imageKey" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "imageKey" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "MachineLine" ADD COLUMN     "imageKey" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "imageKey" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "imageKey" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Element_imageKey_key" ON "Element"("imageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_imageKey_key" ON "Machine"("imageKey");

-- CreateIndex
CREATE UNIQUE INDEX "MachineLine_imageKey_key" ON "MachineLine"("imageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_imageKey_key" ON "Sensor"("imageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_imageKey_key" ON "Shop"("imageKey");
