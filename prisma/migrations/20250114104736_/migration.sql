-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sphere" TEXT DEFAULT '0',
    "cylinder" TEXT DEFAULT '0',
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductDetail" ("category", "createdAt", "cylinder", "id", "productId", "quantity", "sphere", "updatedAt") SELECT "category", "createdAt", "cylinder", "id", "productId", "quantity", "sphere", "updatedAt" FROM "ProductDetail";
DROP TABLE "ProductDetail";
ALTER TABLE "new_ProductDetail" RENAME TO "ProductDetail";
CREATE UNIQUE INDEX "ProductDetail_productId_sphere_cylinder_category_key" ON "ProductDetail"("productId", "sphere", "cylinder", "category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
