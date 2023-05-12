-- CreateEnum
CREATE TYPE "RescueActionType" AS ENUM ('SUBSCRIBE', 'APPROVED', 'RELIEF_PLAN_CREATED', 'RELIEF_PLAN_UPDATED', 'DONATION_POST_CREATED', 'DONATION_POST_UPDATED', 'DONATION_COMPLETED');

-- CreateTable
CREATE TABLE "rescue_action_history" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "RescueActionType" NOT NULL DEFAULT 'SUBSCRIBE',
    "rt_subscription_id" UUID NOT NULL,

    CONSTRAINT "pk_rescue_action_history" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ixfk_rescue_action_history_rt_subscription_id" ON "rescue_action_history"("rt_subscription_id");

-- AddForeignKey
ALTER TABLE "rescue_action_history" ADD CONSTRAINT "fk_rescue_action_history_rt_subscription" FOREIGN KEY ("rt_subscription_id") REFERENCES "rescue_team_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
