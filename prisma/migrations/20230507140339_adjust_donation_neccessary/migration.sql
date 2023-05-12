-- CreateIndex
CREATE INDEX "ixfk_donation_neccessary_post_id" ON "donation_neccessary"("donation_post_id");

-- AddForeignKey
ALTER TABLE "donation_neccessary" ADD CONSTRAINT "fk_donation_neccessary_post" FOREIGN KEY ("donation_post_id") REFERENCES "donation_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
