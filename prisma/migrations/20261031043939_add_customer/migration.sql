/*
  Warnings:

  - You are about to drop the column `createdAt` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "doc_path" TEXT NOT NULL,
    "doc_name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "last_progress" INTEGER NOT NULL,
    "max_progress" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
