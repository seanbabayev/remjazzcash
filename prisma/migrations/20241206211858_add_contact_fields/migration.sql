-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "image" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT;
