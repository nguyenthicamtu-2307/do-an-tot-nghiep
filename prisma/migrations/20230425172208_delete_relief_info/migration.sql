/*
  Warnings:

  - You are about to drop the column `relief_information_id` on the `lo_event_subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ixfk_lo_event_subscription_relief_information_id";

-- DropIndex
DROP INDEX "ixuq_lo_event_subscription_relief_information";

-- AlterTable
ALTER TABLE "lo_event_subscription" DROP COLUMN "relief_information_id";
