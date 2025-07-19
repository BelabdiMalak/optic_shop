/*
  Warnings:

  - You are about to drop the column `cylinder` on the `ProductDetail` table. All the data in the column will be lost.
  - You are about to drop the column `sphere` on the `ProductDetail` table. All the data in the column will be lost.
  - You are about to drop the column `cylinder` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sphere` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sphereL" TEXT DEFAULT '0',
    "cylinderL" TEXT DEFAULT '0',
    "sphereR" TEXT DEFAULT '0',
    "cylinderR" TEXT DEFAULT '0',
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductDetail" ("category", "createdAt", "id", "productId", "quantity", "updatedAt") SELECT "category", "createdAt", "id", "productId", "quantity", "updatedAt" FROM "ProductDetail";
DROP TABLE "ProductDetail";
ALTER TABLE "new_ProductDetail" RENAME TO "ProductDetail";
CREATE UNIQUE INDEX "ProductDetail_productId_sphereL_cylinderL_sphereR_cylinderR_category_key" ON "ProductDetail"("productId", "sphereL", "cylinderL", "sphereR", "cylinderR", "category");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surename" TEXT NOT NULL,
    "sphereL" TEXT,
    "cylinderL" TEXT,
    "sphereR" TEXT,
    "cylinderR" TEXT,
    "axis" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false
);
INSERT INTO "new_User" ("axis", "createdAt", "id", "isDeleted", "name", "surename", "updatedAt") SELECT "axis", "createdAt", "id", "isDeleted", "name", "surename", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
