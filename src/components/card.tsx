import { Package, Tag, Hash } from 'lucide-react'

interface ProductCardProps {
  name: string
  type: string
  subType: string
  quantity: number
}

export default function ProductCard({ name, type, subType, quantity }: ProductCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">{type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{subType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Quantity: {quantity}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

