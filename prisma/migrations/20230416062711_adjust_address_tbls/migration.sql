/*
  Warnings:

  - You are about to drop the column `province_id` on the `district` table. All the data in the column will be lost.
  - You are about to drop the column `district_id` on the `ward` table. All the data in the column will be lost.
  - Added the required column `code` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_with_type` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_code` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_with_type` to the `province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_with_type` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_code` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path_with_type` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "district" DROP CONSTRAINT "fk_province_district";

-- DropForeignKey
ALTER TABLE "ward" DROP CONSTRAINT "fk_district_ward";

-- DropIndex
DROP INDEX "ixfk_province_district";

-- DropIndex
DROP INDEX "ixfk_district_ward";

-- AlterTable
ALTER TABLE "district" DROP COLUMN "province_id",
ADD COLUMN     "code" VARCHAR(10) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "name_with_type" VARCHAR(100) NOT NULL,
ADD COLUMN     "parent_code" VARCHAR(10) NOT NULL,
ADD COLUMN     "path" VARCHAR(100) NOT NULL,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ADD COLUMN     "type" VARCHAR(25) NOT NULL;

-- AlterTable
ALTER TABLE "province" ADD COLUMN     "code" VARCHAR(10) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "name_with_type" VARCHAR(100) NOT NULL,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ADD COLUMN     "type" VARCHAR(25) NOT NULL;

-- AlterTable
ALTER TABLE "ward" DROP COLUMN "district_id",
ADD COLUMN     "code" VARCHAR(10) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "name_with_type" VARCHAR(100) NOT NULL,
ADD COLUMN     "parent_code" VARCHAR(10) NOT NULL,
ADD COLUMN     "path" VARCHAR(100) NOT NULL,
ADD COLUMN     "path_with_type" VARCHAR(255) NOT NULL,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ADD COLUMN     "type" VARCHAR(25) NOT NULL;
