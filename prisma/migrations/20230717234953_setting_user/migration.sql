-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerified` DATETIME(3) NULL,
    MODIFY `email` VARCHAR(191) NULL;
