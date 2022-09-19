-- DropIndex
DROP INDEX `UserId_DreamImageId_unique_constraint` ON `FavoriteDream`;

-- CreateTable
CREATE TABLE `UpscaledDream` (
    `id` VARCHAR(191) NOT NULL,
    `dreamImageId` VARCHAR(191) NOT NULL,
    `upscaledImageURL` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `scale` INTEGER NOT NULL,

    UNIQUE INDEX `UpscaledDream_dreamImageId_key`(`dreamImageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
