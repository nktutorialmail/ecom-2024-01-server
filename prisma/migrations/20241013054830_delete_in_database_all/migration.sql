/*
  Warnings:

  - Made the column `userId` on table `cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cartId` on table `productoncart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `productoncart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `productonorder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderId` on table `productonorder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOnCart_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOnCart_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productonorder` DROP FOREIGN KEY `ProductOnOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `productonorder` DROP FOREIGN KEY `ProductOnOrder_productId_fkey`;

-- AlterTable
ALTER TABLE `cart` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `productId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `categoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `productoncart` MODIFY `cartId` INTEGER NOT NULL,
    MODIFY `productId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `productonorder` MODIFY `productId` INTEGER NOT NULL,
    MODIFY `orderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnOrder` ADD CONSTRAINT `ProductOnOrder_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnOrder` ADD CONSTRAINT `ProductOnOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnCart` ADD CONSTRAINT `ProductOnCart_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnCart` ADD CONSTRAINT `ProductOnCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
