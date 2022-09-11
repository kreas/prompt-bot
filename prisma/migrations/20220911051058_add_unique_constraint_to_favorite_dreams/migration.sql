-- This is an empty migration.
ALTER TABLE `FavoriteDream` ADD CONSTRAINT `UserId_DreamImageId_unique_constraint` UNIQUE (`userId`, `dreamImageId`);
