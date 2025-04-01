/*
  Warnings:

  - You are about to drop the column `image` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Contact` table. All the data in the column will be lost.
  - Made the column `userId` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- DropIndex
DROP INDEX "Contact_userId_idx";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "image",
DROP COLUMN "isDefault",
DROP COLUMN "phoneNumber",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
