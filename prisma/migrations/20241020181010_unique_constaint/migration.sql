/*
  Warnings:

  - A unique constraint covering the columns `[typeId,subTypeId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SubType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_typeId_subTypeId_key" ON "Product"("typeId", "subTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "SubType_name_key" ON "SubType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");
