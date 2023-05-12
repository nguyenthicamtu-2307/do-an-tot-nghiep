-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_local_office_ward" FOREIGN KEY ("local_officer_ward_id") REFERENCES "ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;
