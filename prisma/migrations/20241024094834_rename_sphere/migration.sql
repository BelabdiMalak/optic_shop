/*
  Warnings:

  - You are about to drop the column `shpere` on the `User` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `SubType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sphere` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SubType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "typeId" TEXT NOT NULL,
    CONSTRAINT "SubType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SubType" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "SubType";
DROP TABLE "SubType";
ALTER TABLE "new_SubType" RENAME TO "SubType";
CREATE UNIQUE INDEX "SubType_name_key" ON "SubType"("name");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surename" TEXT NOT NULL,
    "sphere" TEXT NOT NULL,
    "cylinder" TEXT NOT NULL,
    "axis" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("axis", "createdAt", "cylinder", "id", "name", "surename", "updatedAt") SELECT "axis", "createdAt", "cylinder", "id", "name", "surename", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
