/*
  Warnings:

  - You are about to drop the column `axis` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surename" TEXT NOT NULL,
    "sphereL" TEXT,
    "cylinderL" TEXT,
    "sphereR" TEXT,
    "cylinderR" TEXT,
    "axisL" TEXT,
    "axisR" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false
);
INSERT INTO "new_User" ("createdAt", "cylinderL", "cylinderR", "id", "isDeleted", "name", "sphereL", "sphereR", "surename", "updatedAt") SELECT "createdAt", "cylinderL", "cylinderR", "id", "isDeleted", "name", "sphereL", "sphereR", "surename", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
