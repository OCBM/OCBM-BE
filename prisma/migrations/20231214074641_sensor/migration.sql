-- CreateTable
CREATE TABLE "Sensor" (
    "sensor_Id" UUID NOT NULL,
    "sensorId" TEXT NOT NULL,
    "sensorName" TEXT NOT NULL,
    "sensorDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "elementId" UUID NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("sensor_Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_sensorId_key" ON "Sensor"("sensorId");

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("elementId") ON DELETE RESTRICT ON UPDATE CASCADE;
