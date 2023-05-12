/*
  Warnings:

  - You are about to drop the column `rescue_team_leader_name` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "rescue_team_leader_name",
ADD COLUMN     "rescue_team_name" VARCHAR(255);
