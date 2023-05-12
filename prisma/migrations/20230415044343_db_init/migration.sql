DROP EXTENSION IF EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('LOCAL_OFFICER', 'SPONSOR', 'RESCUE_TEAM', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "AdminUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "LocalOfficerUserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RescueTeamUserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SponsorUserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('STORM', 'FLOOD', 'LANDSLIDE', 'TSUNAMI');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'CLOSE', 'OPEN');

-- CreateEnum
CREATE TYPE "DonationPostStatus" AS ENUM ('INCOMPLETED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SponsorDonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'OVERDUE');

-- CreateTable
CREATE TABLE "province" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "pk_province" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "province_id" UUID NOT NULL,

    CONSTRAINT "pk_district" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ward" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "district_id" UUID NOT NULL,

    CONSTRAINT "pk_ward" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" VARCHAR,
    "display_name" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "pk_bank" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_name" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "user_type" "UserType" NOT NULL,
    "avatar_url" VARCHAR,
    "phone_number" VARCHAR(10) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "province_id" UUID NOT NULL,
    "district_id" UUID NOT NULL,
    "ward_id" UUID NOT NULL,
    "local_officer_province_id" TEXT,
    "local_officer_district_id" TEXT,
    "local_officer_ward_id" TEXT,
    "personal_page_id" UUID,
    "refresh_token_id" VARCHAR,
    "bank_name" VARCHAR(255),
    "bank_account_number" VARCHAR(255),
    "rescue_team_leader_name" VARCHAR(255),
    "is_super_admin" BOOLEAN,

    CONSTRAINT "pk_user" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_page" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_type" "UserType" NOT NULL,
    "is_phone_number_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_birthday_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_email_hidden" BOOLEAN NOT NULL DEFAULT false,
    "credibility_score" INTEGER NOT NULL DEFAULT 0,
    "star_rate_average" DECIMAL NOT NULL DEFAULT 5,

    CONSTRAINT "pk_personal_page" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "personal_page_id" UUID NOT NULL,
    "commenter_id" UUID,
    "star_rate" INTEGER DEFAULT 5,
    "comment" VARCHAR NOT NULL,
    "anonymous_user_id" UUID,

    CONSTRAINT "pk_feedback" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymous_user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "pk_anonymous_user" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6),
    "created_by_admin_user_id" UUID NOT NULL,
    "closed_by_admin_user_id" UUID NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "year" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "pk_event" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lo_event_subscription" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lo_user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "relief_information_id" UUID NOT NULL,
    "households_list_url" VARCHAR,
    "households_number" INTEGER NOT NULL,
    "amount_of_money" INTEGER,
    "neccessaries_list" VARCHAR,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_lo_event_subscription" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(10),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "lo_event_subsciption_id" UUID NOT NULL,
    "rt_subscription_id" UUID NOT NULL,

    CONSTRAINT "pk_household" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rescue_team_subscription" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lo_event_subscription_id" UUID NOT NULL,
    "rescue_team_user_id" UUID NOT NULL,
    "closed_at" TIMESTAMPTZ(6),
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "original_money" INTEGER NOT NULL,

    CONSTRAINT "pk_rescue_team_subscription" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relief_plan" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6),
    "rt_subscription_id" UUID NOT NULL,

    CONSTRAINT "pk_relief_plan" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relief_proof" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" VARCHAR NOT NULL,
    "relief_plan_id" UUID NOT NULL,

    CONSTRAINT "pk_relief_proof" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relief_neccessary" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "relief_plan_id" UUID NOT NULL,

    CONSTRAINT "pk_relief_neccessary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aid_package" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR,
    "amount_of_money" INTEGER,
    "total_value" INTEGER NOT NULL,
    "relief_plan_id" UUID NOT NULL,

    CONSTRAINT "pk_aid_package" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aid_neccessary" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255),
    "quantity" INTEGER NOT NULL,
    "aid_package_id" UUID NOT NULL,
    "neccessary_id" UUID NOT NULL,

    CONSTRAINT "pk_aid_neccessary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_post" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR NOT NULL,
    "money_need" INTEGER NOT NULL,
    "deadline" TIMESTAMPTZ(6),
    "status" "DonationPostStatus" NOT NULL DEFAULT 'INCOMPLETED',
    "rt_subscription_id" UUID NOT NULL,

    CONSTRAINT "pk_donation_post" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_neccessary" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relief_neccessary_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "donation_post_id" UUID NOT NULL,

    CONSTRAINT "pk_donation_neccessary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_donation" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sponsor_user_id" UUID NOT NULL,
    "donation_post_id" UUID NOT NULL,
    "status" "SponsorDonationStatus" NOT NULL DEFAULT 'PENDING',
    "deadline" TIMESTAMPTZ(6),
    "money" INTEGER,
    "money_transfer_receipt_img_url" VARCHAR,

    CONSTRAINT "pk_sponsor_donation" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_donation_detail" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sponsor_donation_id" UUID NOT NULL,
    "donation_neccessary_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "pk_sponsor_donation_detail" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ixfk_province_district" ON "district"("province_id");

-- CreateIndex
CREATE INDEX "ixfk_district_ward" ON "ward"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_bank_value" ON "bank"("value");

-- CreateIndex
CREATE INDEX "ixfk_user_personal_page_id" ON "user"("personal_page_id");

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_user_username" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_user_personal_page_id" ON "user"("personal_page_id");

-- CreateIndex
CREATE INDEX "ixfk_feedback_personal_page_id" ON "feedback"("personal_page_id");

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_anonymous_user_email" ON "anonymous_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_anonymous_user_phone_number" ON "anonymous_user"("phone_number");

-- CreateIndex
CREATE INDEX "ixfk_event_created_by_admin_user_id" ON "event"("created_by_admin_user_id");

-- CreateIndex
CREATE INDEX "ixfk_event_closed_by_admin_user_id" ON "event"("closed_by_admin_user_id");

-- CreateIndex
CREATE INDEX "ixfk_lo_event_subscription_relief_information_id" ON "lo_event_subscription"("relief_information_id");

-- CreateIndex
CREATE INDEX "ixfk_lo_event_subscription_event_id" ON "lo_event_subscription"("event_id");

-- CreateIndex
CREATE INDEX "ixfk_lo_event_subscription_local_officer_user_id" ON "lo_event_subscription"("lo_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_lo_event_subscription_relief_information" ON "lo_event_subscription"("relief_information_id");

-- CreateIndex
CREATE INDEX "ixfk_lo_event_subsciption_id" ON "household"("lo_event_subsciption_id");

-- CreateIndex
CREATE INDEX "ixfk_household_rt_subscription_id" ON "household"("rt_subscription_id");

-- CreateIndex
CREATE INDEX "ixfk_rescue_team_subscription_rescue_team_user_id" ON "rescue_team_subscription"("rescue_team_user_id");

-- CreateIndex
CREATE INDEX "ixfk_rescue_team_subscription_lo_event_subscription_id" ON "rescue_team_subscription"("lo_event_subscription_id");

-- CreateIndex
CREATE INDEX "ixfk_relief_plan_rt_subscription_id" ON "relief_plan"("rt_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "uqfk_relief_plan_rt_subscription_id" ON "relief_plan"("rt_subscription_id");

-- CreateIndex
CREATE INDEX "ixfk_relief_proof_relief_plan_id" ON "relief_proof"("relief_plan_id");

-- CreateIndex
CREATE INDEX "ixfk_relief_neccessary_relief_plan_id" ON "relief_neccessary"("relief_plan_id");

-- CreateIndex
CREATE INDEX "ixfk_aid_package_relief_plan_id" ON "aid_package"("relief_plan_id");

-- CreateIndex
CREATE INDEX "ixfk_aid_package_neccessary_aid_package_id" ON "aid_neccessary"("aid_package_id");

-- CreateIndex
CREATE INDEX "ixfk_aid_package_neccessary_relief_neccessary_id" ON "aid_neccessary"("neccessary_id");

-- CreateIndex
CREATE UNIQUE INDEX "uqfk_aid_package_neccessary_relief_neccessary_id" ON "aid_neccessary"("neccessary_id");

-- CreateIndex
CREATE INDEX "ixfk_donation_post_rt_subscription_id" ON "donation_post"("rt_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "uqfk_donation_post_rt_subscription_id" ON "donation_post"("rt_subscription_id");

-- CreateIndex
CREATE INDEX "ixfk_donation_neccessary_relief_neccessary_id" ON "donation_neccessary"("relief_neccessary_id");

-- CreateIndex
CREATE UNIQUE INDEX "uqfk_donation_neccessary_relief_neccessary_id" ON "donation_neccessary"("relief_neccessary_id");

-- CreateIndex
CREATE INDEX "ixfk_sponsor_donation_donation_post_id" ON "sponsor_donation"("donation_post_id");

-- CreateIndex
CREATE INDEX "ixfk_sponsor_donation_sponsor_user_id" ON "sponsor_donation"("sponsor_user_id");

-- CreateIndex
CREATE INDEX "ixfk_sponsor_donation_detail_donation_neccessary_id" ON "sponsor_donation_detail"("donation_neccessary_id");

-- CreateIndex
CREATE INDEX "ixfk_sponsor_donation_detail_sponsor_donation_id" ON "sponsor_donation_detail"("sponsor_donation_id");

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "fk_province_district" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ward" ADD CONSTRAINT "fk_district_ward" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_personal_page" FOREIGN KEY ("personal_page_id") REFERENCES "personal_page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "fk_feedback_anonymous_user" FOREIGN KEY ("anonymous_user_id") REFERENCES "anonymous_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "fk_feedback_commenter" FOREIGN KEY ("commenter_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "fk_feedback_personal_page" FOREIGN KEY ("personal_page_id") REFERENCES "personal_page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "fk_event_created_by" FOREIGN KEY ("created_by_admin_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "fk_event_closed_by" FOREIGN KEY ("closed_by_admin_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lo_event_subscription" ADD CONSTRAINT "fk_lo_event_subscription_event" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lo_event_subscription" ADD CONSTRAINT "fk_lo_event_local_officer" FOREIGN KEY ("lo_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household" ADD CONSTRAINT "fk_household_lo_event_subsciption" FOREIGN KEY ("lo_event_subsciption_id") REFERENCES "lo_event_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household" ADD CONSTRAINT "fk_household_rt_subscription" FOREIGN KEY ("rt_subscription_id") REFERENCES "rescue_team_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_team_subscription" ADD CONSTRAINT "fk_rescue_team_subscription_rescue_team_user" FOREIGN KEY ("rescue_team_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_team_subscription" ADD CONSTRAINT "fk_rescue_team_subscription_lo_event_subscription" FOREIGN KEY ("lo_event_subscription_id") REFERENCES "lo_event_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relief_plan" ADD CONSTRAINT "fk_relief_plan_rt_subscription" FOREIGN KEY ("rt_subscription_id") REFERENCES "rescue_team_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relief_proof" ADD CONSTRAINT "fk_relief_proof_relief_plan" FOREIGN KEY ("relief_plan_id") REFERENCES "relief_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relief_neccessary" ADD CONSTRAINT "fk_relief_neccessary_relief_plan" FOREIGN KEY ("relief_plan_id") REFERENCES "relief_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aid_package" ADD CONSTRAINT "fk_aid_package_relief_plan" FOREIGN KEY ("relief_plan_id") REFERENCES "relief_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aid_neccessary" ADD CONSTRAINT "fk_aid_package_neccessary_aid_package" FOREIGN KEY ("aid_package_id") REFERENCES "aid_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aid_neccessary" ADD CONSTRAINT "fk_aid_package_neccessary_relief_neccessary" FOREIGN KEY ("neccessary_id") REFERENCES "relief_neccessary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_post" ADD CONSTRAINT "fk_donation_post_rt_subscription" FOREIGN KEY ("rt_subscription_id") REFERENCES "rescue_team_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_neccessary" ADD CONSTRAINT "fk_donation_neccessary_relief_neccessary" FOREIGN KEY ("relief_neccessary_id") REFERENCES "relief_neccessary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_donation" ADD CONSTRAINT "fk_sponsor_donation_donation_post" FOREIGN KEY ("donation_post_id") REFERENCES "donation_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_donation" ADD CONSTRAINT "fk_sponsor_donation_sponsor_user" FOREIGN KEY ("sponsor_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_donation_detail" ADD CONSTRAINT "fk_sponsor_donation_detail_sponsor_donation" FOREIGN KEY ("sponsor_donation_id") REFERENCES "sponsor_donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_donation_detail" ADD CONSTRAINT "fk_sponsor_donation_detail_donation_neccessary" FOREIGN KEY ("donation_neccessary_id") REFERENCES "donation_neccessary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
