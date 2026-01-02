/*
  Warnings:

  - Added the required column `lang` to the `words` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WordEnum" AS ENUM ('en', 'cn', 'es');

-- AlterTable
ALTER TABLE "words" ADD COLUMN     "lang" "WordEnum" NOT NULL;
