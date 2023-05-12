-- CreateIndex
CREATE INDEX "ixfk_user_ward_id" ON "user"("ward_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_ward" FOREIGN KEY ("ward_id") REFERENCES "ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
