-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('NOVO_LEAD', 'CONTATO_FEITO', 'QUALIFICADO', 'PROPOSTA', 'FECHADO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "LeadTemperature" AS ENUM ('HOT', 'WARM', 'COLD');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "googleMapsUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewsCount" INTEGER,
    "searchTerm" TEXT NOT NULL,
    "searchLocation" TEXT NOT NULL,
    "stage" "FunnelStage" NOT NULL DEFAULT 'NOVO_LEAD',
    "temperature" "LeadTemperature" NOT NULL DEFAULT 'WARM',
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Lead_temperature_idx" ON "Lead"("temperature");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_name_address_key" ON "Lead"("name", "address");

-- CreateIndex
CREATE INDEX "Activity_leadId_idx" ON "Activity"("leadId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
