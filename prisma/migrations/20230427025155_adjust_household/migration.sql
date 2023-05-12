-- DropForeignKey
ALTER TABLE "household" DROP CONSTRAINT "fk_household_rt_subscription";

-- AlterTable
ALTER TABLE "household" ALTER COLUMN "rt_subscription_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "household" ADD CONSTRAINT "fk_household_rt_subscription" FOREIGN KEY ("rt_subscription_id") REFERENCES "rescue_team_subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
