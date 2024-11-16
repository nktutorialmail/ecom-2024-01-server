-- AlterTable
ALTER TABLE `cart` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `productoncart` MODIFY `cartId` INTEGER NULL,
    MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `productonorder` MODIFY `productId` INTEGER NULL,
    MODIFY `orderId` INTEGER NULL;
