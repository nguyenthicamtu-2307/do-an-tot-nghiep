/*
  Warnings:

  - Added the required column `path_with_type` to the `district` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "district" ADD COLUMN     "path_with_type" VARCHAR(255) NOT NULL;
