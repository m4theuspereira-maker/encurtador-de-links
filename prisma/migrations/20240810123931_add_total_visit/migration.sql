-- AlterTable
ALTER TABLE "shortUrl" ADD COLUMN     "lastVisit" TIMESTAMP(3),
ADD COLUMN     "totalVisits" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
