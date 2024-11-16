/*
  Warnings:

  - You are about to drop the column `carbo` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `fiber` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `moisture` on the `Food` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Food` DROP FOREIGN KEY `Food_userId_fkey`;

-- AlterTable
ALTER TABLE `Food` DROP COLUMN `carbo`,
    DROP COLUMN `fiber`,
    DROP COLUMN `moisture`,
    ADD COLUMN `carbohydrates` INTEGER NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Food` ADD CONSTRAINT `Food_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
