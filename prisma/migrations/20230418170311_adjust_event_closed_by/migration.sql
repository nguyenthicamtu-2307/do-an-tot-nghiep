-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "fk_event_closed_by";

-- AlterTable
ALTER TABLE "event" ALTER COLUMN "closed_by_admin_user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "fk_event_closed_by" FOREIGN KEY ("closed_by_admin_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
