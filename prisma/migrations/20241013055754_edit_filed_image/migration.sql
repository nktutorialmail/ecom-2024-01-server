/*
  Warnings:

  - Made the column `asset_id` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `public_id` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secure_url` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `image` MODIFY `asset_id` VARCHAR(191) NOT NULL,
    MODIFY `public_id` VARCHAR(191) NOT NULL,
    MODIFY `url` VARCHAR(191) NOT NULL,
    MODIFY `secure_url` VARCHAR(191) NOT NULL;
