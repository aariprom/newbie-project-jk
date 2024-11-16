-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `pw` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL,
    `modifiedDate` DATETIME(3) NOT NULL,
    `profilePicUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Food` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL,
    `carbohydrates` INTEGER NULL DEFAULT 0,
    `fat` INTEGER NULL DEFAULT 0,
    `protein` INTEGER NULL DEFAULT 0,
    `sugars` INTEGER NULL DEFAULT 0,
    `calories` INTEGER NULL DEFAULT 0,
    `sodium` INTEGER NULL DEFAULT 0,
    `category` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavoriteFood` (
    `userId` VARCHAR(191) NOT NULL,
    `foodId` INTEGER NOT NULL,

    UNIQUE INDEX `FavoriteFood_userId_foodId_key`(`userId`, `foodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NULL,
    `type` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'OTHERS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodsInDiet` (
    `dietId` INTEGER NOT NULL,
    `foodId` INTEGER NOT NULL,

    UNIQUE INDEX `FoodsInDiet_dietId_foodId_key`(`dietId`, `foodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Picture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `createdDate` DATETIME(3) NOT NULL,
    `modifiedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RefreshToken_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Food` ADD CONSTRAINT `Food_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteFood` ADD CONSTRAINT `FavoriteFood_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diet` ADD CONSTRAINT `Diet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodsInDiet` ADD CONSTRAINT `FoodsInDiet_dietId_fkey` FOREIGN KEY (`dietId`) REFERENCES `Diet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodsInDiet` ADD CONSTRAINT `FoodsInDiet_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Picture` ADD CONSTRAINT `Picture_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
