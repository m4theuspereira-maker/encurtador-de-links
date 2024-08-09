-- CreateTable
CREATE TABLE "shortUrl" (
    "id" UUID NOT NULL,
    "shortId" TEXT NOT NULL,
    "userId" UUID,
    "redirectUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "shortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shortUrl_userId_idx" ON "shortUrl"("userId");

-- CreateIndex
CREATE INDEX "shortUrl_shortId_deletedAt_idx" ON "shortUrl"("shortId", "deletedAt");

-- CreateIndex
CREATE INDEX "shortUrl_redirectUrl_deletedAt_idx" ON "shortUrl"("redirectUrl", "deletedAt");

-- CreateIndex
CREATE INDEX "user_email_deletedAt_idx" ON "user"("email", "deletedAt");

-- CreateIndex
CREATE INDEX "user_updatedAt_idx" ON "user"("updatedAt");
