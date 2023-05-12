/*
  Warnings:

  - The primary key for the `district` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `province` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ward` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "district" DROP CONSTRAINT "pk_district",
ALTER COLUMN "id" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "pk_district" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "province" DROP CONSTRAINT "pk_province",
ALTER COLUMN "id" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "pk_province" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ward" DROP CONSTRAINT "pk_ward",
ALTER COLUMN "id" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "pk_ward" PRIMARY KEY ("id");
