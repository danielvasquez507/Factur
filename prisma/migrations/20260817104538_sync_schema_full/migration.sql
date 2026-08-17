-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PYME', 'TRANSPORTE_ESCOLAR');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "company_type" "CompanyType" NOT NULL DEFAULT 'PYME',
ADD COLUMN     "contract_sections" JSONB,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "id" DROP DEFAULT;
