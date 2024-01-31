/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminToGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminToOrganization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminToPlant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AdminToGroup" DROP CONSTRAINT "_AdminToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToGroup" DROP CONSTRAINT "_AdminToGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToOrganization" DROP CONSTRAINT "_AdminToOrganization_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToOrganization" DROP CONSTRAINT "_AdminToOrganization_B_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToPlant" DROP CONSTRAINT "_AdminToPlant_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToPlant" DROP CONSTRAINT "_AdminToPlant_B_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "_AdminToGroup";

-- DropTable
DROP TABLE "_AdminToOrganization";

-- DropTable
DROP TABLE "_AdminToPlant";
