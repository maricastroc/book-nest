-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'PENDING';
