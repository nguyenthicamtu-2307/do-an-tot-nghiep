/*
  Warnings:

  - A unique constraint covering the columns `[relief_plan_id]` on the table `aid_package` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "aid_package" ADD COLUMN     "neccessaries_list" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "uqfk_aid_package_relief_plan_id" ON "aid_package"("relief_plan_id");
