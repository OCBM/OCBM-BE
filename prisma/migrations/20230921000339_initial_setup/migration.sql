-- CreateTable
CREATE TABLE "Admin" (
    "userid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "employeeid" TEXT NOT NULL,
    "name" TEXT,
    "position" TEXT,
    "role" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "User" (
    "userid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "employeeid" TEXT NOT NULL,
    "name" TEXT,
    "position" TEXT,
    "role" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_employeeid_key" ON "Admin"("employeeid");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeid_key" ON "User"("employeeid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
