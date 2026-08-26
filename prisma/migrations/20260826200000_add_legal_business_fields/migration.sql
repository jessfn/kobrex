-- AlterTable: User — perfil de negocio para membrete en PDFs
ALTER TABLE "User" ADD COLUMN "businessName" TEXT;
ALTER TABLE "User" ADD COLUMN "rfc" TEXT;
ALTER TABLE "User" ADD COLUMN "fiscalAddress" TEXT;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "taxRegime" TEXT;

-- AlterTable: Client — datos fiscales opcionales
ALTER TABLE "Client" ADD COLUMN "rfc" TEXT;
ALTER TABLE "Client" ADD COLUMN "address" TEXT;

-- AlterTable: Invoice — forma de pago y desglose de IVA opcional
ALTER TABLE "Invoice" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "applyIva" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Invoice" ADD COLUMN "ivaRate" DECIMAL(5,2) NOT NULL DEFAULT 16.00;
ALTER TABLE "Invoice" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'MXN';
