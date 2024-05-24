import { AppDataSource } from "../app-data-source";
import { ProductNotFoundError, ValidationError } from "../lib/errors";
import { calcPaginationMeta } from "../lib/util";
import { ValidateParams } from "../lib/validation";
import { ValidationMsg } from "../lib/validation-msg";
import {
  AddProductAid,
  DeleteProductAid,
  GetProductAid,
  GetProductListAid,
  UpdateProductAid,
} from "../model/aids/product.aids";
import { ProductDto, ProductDtoList } from "../model/dtos/products.dto";
import Product from "../model/entity/product";

export abstract class IProductService {
  public abstract addProduct(data: AddProductAid): Promise<ProductDto>;
  public abstract getProductById(data: GetProductAid): Promise<ProductDto>;
  public abstract getProductList(data: GetProductListAid): Promise<ProductDtoList>;
  public abstract updateProduct(data: UpdateProductAid): Promise<ProductDto>;
  public abstract deleteProduct(data: DeleteProductAid): Promise<void>;
}

export class ProductService implements IProductService {
  @ValidateParams(AddProductAid)
  public async addProduct(data: AddProductAid): Promise<ProductDto> {
    const em = AppDataSource.manager;

    const product = new Product();
    product.title = data.title;
    product.price = data.price;
    product.category = data.category;
    product.description = data.description ? data.description : null;

    await em.save(product);

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      createdAt: product.createdAt,
      description: product.description,
    };
  }

  @ValidateParams(GetProductAid)
  public async getProductById(data: GetProductAid): Promise<ProductDto> {
    const em = AppDataSource.manager;

    const product = await em.findOne(Product, {
      where: {
        id: data.id,
      },
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      createdAt: product.createdAt,
      description: product.description,
    };
  }

  @ValidateParams(GetProductListAid)
  public async getProductList(
    data: GetProductListAid
  ): Promise<ProductDtoList> {
    const em = AppDataSource.manager;
    const res = new ProductDtoList();

    function addFilters(query: any) {
      // here we can add more options for queries
      // ex: id or query that can could search using :LIKE
      if (data.title && data.title.trim() !== "") {
        query.andWhere("product.title = :title", { title: data.title });
      }
    }

    const dbQuery = em
      .createQueryBuilder()
      .select("product")
      .from(Product, "product")
      .orderBy("product.id", "ASC")
      .offset((data.pageNum - 1) * data.pageSize)
      .limit(data.pageSize);

    addFilters(dbQuery);
    const queryRes = await dbQuery.getManyAndCount();

    res.items = [];
    for (const product of queryRes[0]) {
      res.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        createdAt: product.createdAt,
        description: product.description,
      });
    }

    res.meta = calcPaginationMeta(data, queryRes[1]);

    return res;
  }

  @ValidateParams(UpdateProductAid)
  public async updateProduct(data: UpdateProductAid): Promise<ProductDto> {
    const em = AppDataSource.manager;

    return em.transaction(async (manager) => {
      const product = await manager.getRepository(Product).findOne({
        where: {
          id: data.id,
        },
        lock: {
          mode: "pessimistic_write",
        },
      });

      if (!product) {
        throw new ProductNotFoundError();
      }

      product.title = data.title;
      product.price = data.price;
      product.category = data.category;
      product.description = data.description;

      await manager.save(product);

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        createdAt: product.createdAt,
        description: product.description,
      };
    });
  }

  @ValidateParams(DeleteProductAid)
  public async deleteProduct({id}: DeleteProductAid): Promise<void> {
    const em = AppDataSource.manager;

    return em.transaction(async (manager) => {
        const product = await manager.getRepository(Product).findOne({
            where: {
              id: id,
            },
            lock: {
              mode: "pessimistic_write",
            },
        });

        if (!product) {
            throw new ProductNotFoundError();
        }

        await manager.delete(Product, {id: product.id})
    })
  }
}