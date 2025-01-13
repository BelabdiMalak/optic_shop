/*
  Warnings:

  - You are about to drop the column `category` on the `ProductDetail` table. All the data in the column will be lost.
  - You are about to drop the column `axis` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deposit" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "framePrice" INTEGER DEFAULT 0,
    "productPrice" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "detailsId" TEXT,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "ProductDetail" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "date", "deposit", "framePrice", "id", "productId", "productPrice", "status", "updatedAt", "userId") SELECT "createdAt", "date", "deposit", "framePrice", "id", "productId", "productPrice", "status", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_ProductDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sphere" TEXT,
    "cylinder" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductDetail" ("createdAt", "cylinder", "id", "productId", "sphere", "updatedAt") SELECT "createdAt", "cylinder", "id", "productId", "sphere", "updatedAt" FROM "ProductDetail";
DROP TABLE "ProductDetail";
ALTER TABLE "new_ProductDetail" RENAME TO "ProductDetail";
CREATE UNIQUE INDEX "ProductDetail_productId_sphere_cylinder_type_key" ON "ProductDetail"("productId", "sphere", "cylinder", "type");
CREATE TABLE "new_Stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    "detailsId" TEXT,
    CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stock_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "ProductDetail" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("createdAt", "date", "id", "productId", "quantity", "type", "updatedAt") SELECT "createdAt", "date", "id", "productId", "quantity", "type", "updatedAt" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surename" TEXT NOT NULL,
    "sphere" TEXT,
    "cylinder" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false
);
INSERT INTO "new_User" ("createdAt", "cylinder", "id", "isDeleted", "name", "sphere", "surename", "updatedAt") SELECT "createdAt", "cylinder", "id", "isDeleted", "name", "sphere", "surename", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
