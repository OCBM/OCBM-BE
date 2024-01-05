/*
  Warnings:

  - A unique constraint covering the columns `[imageKey]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plant_imageKey_key" ON "Plant"("imageKey");
