-- AlterTable
ALTER TABLE "companies" DROP COLUMN IF EXISTS "sri_token",
DROP COLUMN IF EXISTS "sri_token_iv";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "locked_until" TIMESTAMP(3),
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;
