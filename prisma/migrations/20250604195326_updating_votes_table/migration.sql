-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_ratingId_fkey";

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
