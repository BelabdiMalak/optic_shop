/*
  Warnings:

  - You are about to drop the column `type` on the `ProductDetail` table. All the data in the column will be lost.
  - Added the required column `category` to the `ProductDetail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sphere" TEXT,
    "cylinder" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductDetail" ("createdAt", "cylinder", "id", "productId", "quantity", "sphere", "updatedAt") SELECT "createdAt", "cylinder", "id", "productId", "quantity", "sphere", "updatedAt" FROM "ProductDetail";
DROP TABLE "ProductDetail";
ALTER TABLE "new_ProductDetail" RENAME TO "ProductDetail";
CREATE UNIQUE INDEX "ProductDetail_productId_sphere_cylinder_category_key" ON "ProductDetail"("productId", "sphere", "cylinder", "category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
