-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "invoice_color" TEXT NOT NULL DEFAULT 'blue',
ADD COLUMN     "invoice_template" TEXT NOT NULL DEFAULT 'modern';
