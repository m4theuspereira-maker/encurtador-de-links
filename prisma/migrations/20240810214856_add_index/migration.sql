/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `shortUrl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shortUrl_id_userId_key" ON "shortUrl"("id", "userId");
