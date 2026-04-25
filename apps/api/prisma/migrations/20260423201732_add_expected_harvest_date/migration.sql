/*
  Warnings:

  - Added the required column `expectedHarvestDate` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "expectedHarvestDate" TIMESTAMP(3) NOT NULL;
