/*
  Warnings:

  - You are about to drop the `point_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `draw_events` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `exp` on the `user_pets` table. All the data in the column will be lost.
  - You are about to drop the column `isShiny` on the `user_pets` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `user_pets` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `draw_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adultImageUrl` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `babyImageUrl` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "point_history";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "posts";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "showcase_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "userPetId" TEXT NOT NULL,
    CONSTRAINT "showcase_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "showcase_posts_userPetId_fkey" FOREIGN KEY ("userPetId") REFERENCES "user_pets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "showcase_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("content", "createdAt", "id", "postId", "updatedAt") SELECT "content", "createdAt", "id", "postId", "updatedAt" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE INDEX "comments_postId_idx" ON "comments"("postId");
CREATE TABLE "new_draw_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "seriesId" INTEGER NOT NULL,
    CONSTRAINT "draw_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "draw_events_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_draw_events" ("amount", "createdAt", "id", "seriesId", "userId") SELECT "amount", "createdAt", "id", "seriesId", "userId" FROM "draw_events";
DROP TABLE "draw_events";
ALTER TABLE "new_draw_events" RENAME TO "draw_events";
CREATE INDEX "draw_events_userId_idx" ON "draw_events"("userId");
CREATE TABLE "new_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "showcase_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_likes" ("id", "postId", "userId") SELECT "id", "postId", "userId" FROM "likes";
DROP TABLE "likes";
ALTER TABLE "new_likes" RENAME TO "likes";
CREATE INDEX "likes_postId_idx" ON "likes"("postId");
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "likes"("userId", "postId");
CREATE TABLE "new_pets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "babyImageUrl" TEXT NOT NULL,
    "adultImageUrl" TEXT NOT NULL,
    "story" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "seriesId" INTEGER NOT NULL,
    CONSTRAINT "pets_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_pets" ("createdAt", "id", "name", "rarity", "seriesId", "updatedAt") SELECT "createdAt", "id", "name", "rarity", "seriesId", "updatedAt" FROM "pets";
DROP TABLE "pets";
ALTER TABLE "new_pets" RENAME TO "pets";
CREATE UNIQUE INDEX "pets_seriesId_name_key" ON "pets"("seriesId", "name");
CREATE TABLE "new_series" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "drawPrice" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availableFrom" DATETIME,
    "availableUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_series" ("createdAt", "description", "id", "isActive", "name", "updatedAt") SELECT "createdAt", "description", "id", "isActive", "name", "updatedAt" FROM "series";
DROP TABLE "series";
ALTER TABLE "new_series" RENAME TO "series";
CREATE UNIQUE INDEX "series_name_key" ON "series"("name");
CREATE TABLE "new_user_pets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT,
    "growthValue" INTEGER NOT NULL DEFAULT 0,
    "maxGrowth" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'BABY',
    "lastInteractedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "drawEventId" TEXT,
    CONSTRAINT "user_pets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_pets_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_pets_drawEventId_fkey" FOREIGN KEY ("drawEventId") REFERENCES "draw_events" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_user_pets" ("createdAt", "id", "nickname", "petId", "updatedAt", "userId") SELECT "createdAt", "id", "nickname", "petId", "updatedAt", "userId" FROM "user_pets";
DROP TABLE "user_pets";
ALTER TABLE "new_user_pets" RENAME TO "user_pets";
CREATE INDEX "user_pets_userId_idx" ON "user_pets"("userId");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "points" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "id", "password", "points", "updatedAt", "username") SELECT "createdAt", "id", "password", "points", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "showcase_posts_userPetId_key" ON "showcase_posts"("userPetId");

-- CreateIndex
CREATE INDEX "showcase_posts_authorId_idx" ON "showcase_posts"("authorId");
