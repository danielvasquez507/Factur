/*
  Warnings:

  - Added the required column `celular` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "celular" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "payment_details" TEXT;
