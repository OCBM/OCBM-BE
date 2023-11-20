-- CreateTable
DROP TABLE IF EXISTS "Admin";

CREATE TABLE "Admin" (
    "userId" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT,
    "position" TEXT,
    "role" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT,
    "position" TEXT,
    "role" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Group" (
    "groupId" UUID NOT NULL,
    "groupName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("groupId")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceId" UUID NOT NULL,
    "serviceName" TEXT NOT NULL,
    "permissions" TEXT[],
    "groupId" UUID NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "organizationId" UUID NOT NULL,
    "organizationName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "Plant" (
    "plantId" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "plantName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "organizationId" UUID NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("plantId")
);

-- CreateTable
CREATE TABLE "Shop" (
    "shopId" UUID NOT NULL,
    "shopName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "plantId" UUID NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("shopId")
);

-- CreateTable
CREATE TABLE "MachineLine" (
    "machineLineId" UUID NOT NULL,
    "machineLineName" TEXT NOT NULL,
    "machineLineDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "shopId" UUID NOT NULL,

    CONSTRAINT "MachineLine_pkey" PRIMARY KEY ("machineLineId")
);

-- CreateTable
CREATE TABLE "Machine" (
    "machineId" UUID NOT NULL,
    "machineName" TEXT NOT NULL,
    "machineDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "machineLineId" UUID NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("machineId")
);

-- CreateTable
CREATE TABLE "Element" (
    "elementId" UUID NOT NULL,
    "elementName" TEXT NOT NULL,
    "elementDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "machineId" UUID NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("elementId")
);

-- CreateTable
CREATE TABLE "_AdminToGroup" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToOrganization" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToPlant" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToGroup" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToOrganization" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToPlant" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userName_key" ON "Admin"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_employeeId_key" ON "Admin"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupName_key" ON "Group"("groupName");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToGroup_AB_unique" ON "_AdminToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToGroup_B_index" ON "_AdminToGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToOrganization_AB_unique" ON "_AdminToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToOrganization_B_index" ON "_AdminToOrganization"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToPlant_AB_unique" ON "_AdminToPlant"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToPlant_B_index" ON "_AdminToPlant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToGroup_AB_unique" ON "_UserToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToGroup_B_index" ON "_UserToGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToOrganization_AB_unique" ON "_UserToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToOrganization_B_index" ON "_UserToOrganization"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToPlant_AB_unique" ON "_UserToPlant"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToPlant_B_index" ON "_UserToPlant"("B");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("plantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineLine" ADD CONSTRAINT "MachineLine_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("shopId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_machineLineId_fkey" FOREIGN KEY ("machineLineId") REFERENCES "MachineLine"("machineLineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("machineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToGroup" ADD CONSTRAINT "_AdminToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToGroup" ADD CONSTRAINT "_AdminToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToOrganization" ADD CONSTRAINT "_AdminToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToOrganization" ADD CONSTRAINT "_AdminToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToPlant" ADD CONSTRAINT "_AdminToPlant_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToPlant" ADD CONSTRAINT "_AdminToPlant_B_fkey" FOREIGN KEY ("B") REFERENCES "Plant"("plantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToGroup" ADD CONSTRAINT "_UserToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToGroup" ADD CONSTRAINT "_UserToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToOrganization" ADD CONSTRAINT "_UserToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToOrganization" ADD CONSTRAINT "_UserToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToPlant" ADD CONSTRAINT "_UserToPlant_A_fkey" FOREIGN KEY ("A") REFERENCES "Plant"("plantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToPlant" ADD CONSTRAINT "_UserToPlant_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
