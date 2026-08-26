-- AlterTable: passwordHash pasa a opcional (cuentas de Google no tienen contraseña propia)
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- AlterTable: registro legal de aceptación de Términos/Aviso de Privacidad
ALTER TABLE "User" ADD COLUMN "acceptedTermsAt" TIMESTAMP(3);

-- Los usuarios que ya existían se registraron aceptando el checkbox de Términos
-- en el formulario de registro; se les asigna su fecha de alta como fecha de aceptación.
UPDATE "User" SET "acceptedTermsAt" = "createdAt" WHERE "acceptedTermsAt" IS NULL;
