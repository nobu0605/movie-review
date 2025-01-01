/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_movieId_fkey";

-- DropForeignKey
ALTER TABLE "_MovieGenres" DROP CONSTRAINT "_MovieGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieGenres" DROP CONSTRAINT "_MovieGenres_B_fkey";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "_MovieGenres";
