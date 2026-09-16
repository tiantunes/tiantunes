-- CreateTable
CREATE TABLE "ClassifierConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "noWebsiteScore" INTEGER NOT NULL DEFAULT 40,
    "noPhoneScore" INTEGER NOT NULL DEFAULT 5,
    "fewReviewsThreshold" INTEGER NOT NULL DEFAULT 10,
    "fewReviewsScore" INTEGER NOT NULL DEFAULT 20,
    "moderateReviewsThreshold" INTEGER NOT NULL DEFAULT 50,
    "moderateReviewsScore" INTEGER NOT NULL DEFAULT 10,
    "lowRatingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 3.5,
    "lowRatingScore" INTEGER NOT NULL DEFAULT 15,
    "highRatingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "highRatingReviewsThreshold" INTEGER NOT NULL DEFAULT 50,
    "highRatingScore" INTEGER NOT NULL DEFAULT 10,
    "noRatingScore" INTEGER NOT NULL DEFAULT 10,
    "hotThreshold" INTEGER NOT NULL DEFAULT 55,
    "warmThreshold" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassifierConfig_pkey" PRIMARY KEY ("id")
);
