-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "contracts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "client_service_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "clauses" JSONB NOT NULL,
    "responsibilities" JSONB NOT NULL,
    "conditions" JSONB NOT NULL,
    "exceptions" JSONB NOT NULL,
    "pdf_template" TEXT NOT NULL DEFAULT 'professional',
    "pdf_color" TEXT NOT NULL DEFAULT 'slate',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT IF EXISTS "contracts_company_id_fkey";
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "contracts" DROP CONSTRAINT IF EXISTS "contracts_client_id_fkey";
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "contracts" DROP CONSTRAINT IF EXISTS "contracts_client_service_id_fkey";
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_service_id_fkey" FOREIGN KEY ("client_service_id") REFERENCES "client_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
