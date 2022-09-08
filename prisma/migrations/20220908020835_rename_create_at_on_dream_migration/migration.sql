-- AlterTable
ALTER TABLE `Dream` ADD COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
UPDATE `Dream` SET `createdAt` = `createAt`;
ALTER TABLE `Dream` DROP COLUMN `createAt`;

-- AlterTable
ALTER TABLE `DreamImage` ADD COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
UPDATE `DreamImage` SET `createdAt` = `createAt`;
ALTER TABLE `DreamImage` DROP COLUMN `createAt`;
