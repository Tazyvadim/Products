import { ProductCategory } from "../../lib/types";

export class ProductDto {
    id: number;
    title: string;
    price: number;
    category: ProductCategory
    createdAt: Date;
    description?: string
}

export class ProductDtoList {
    items: ProductDto[];
    meta: {
        count: number
        pageNum: number
        pageSize: number
      }
}