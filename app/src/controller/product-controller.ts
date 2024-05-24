import { Inject } from 'typescript-ioc';
import { DELETE, GET, Path, PathParam, POST, PUT, QueryParam, Security } from 'typescript-rest';
import { Response, Tags } from 'typescript-rest-swagger';
import BaseController from './base-controller';
import { AddProductAid, DeleteProductAid, UpdateProductAid } from '../model/aids/product.aids';
import { ProductDto, ProductDtoList } from '../model/dtos/products.dto';
import { IProductService } from '../service/product-service';
import ErrorResponse from '../model/error-response';

@Path('/products')
export class ProductController extends BaseController {
    @Inject
    private productService: IProductService;

    /**
     * Add new product
     */
    @Response<ErrorResponse>(422, "Validation error", {
        error: "validationError",
        statusCode: 422,
        detailedInfo: [
          {
            property: "title",
            constraints: { isNotEmpty: "cannot_be_empty", isString: 'wrong_value' },
          },
          {
            property: "price",
            constraints: { isNotEmpty: "cannot_be_empty", min: '1'},
          },
          {
            property: "category",
            constraints: { isNotEmpty: "cannot_be_empty", isEnum: 'wrong_value'},
          },
          {
            value: 123,
            property: "description",
            constraints: { isString: 'wrong_value' },
          },
        ],
    })
    @Path('')
    @POST
    @Security()
    @Tags('Products')
    public addProduct(data: AddProductAid): Promise<ProductDto> {
        return this.productService.addProduct(data);
    }

    @Response<ErrorResponse>(409, "Product is not found error", {
        error: "productNotFound",
        statusCode: 409,
    })
    @Response<ErrorResponse>(422, "Validation error", {
        error: "validationError",
        statusCode: 422,
        detailedInfo: [
            {
                value: null,
                property: "id",
                constraints: { isInt: 'wrong_value' },
            }
        ],
    })
    @Path('/:productId')
    @GET
    @Security()
    @Tags('Products')
    public getProductById(
        @PathParam('productId') productId: number,
    ): Promise<ProductDto> {
        return this.productService.getProductById({id: productId});
    }

    @Path('')
    @GET
    @Security()
    @Tags('Products')
    public getProductsList(
        @QueryParam('pageNum') pageNum: number = 1,
        @QueryParam('pageSize') pageSize: number = 20,
        @QueryParam('title') title: string, 
    ): Promise<ProductDtoList> {
        return this.productService.getProductList({
            pageNum,
            pageSize,
            title: title ? title : null,
        })
    }


    @Response<ErrorResponse>(409, "Product is not found error", {
        error: "productNotFound",
        statusCode: 409,
    })
    @Response<ErrorResponse>(422, "Validation error", {
        error: "validationError",
        statusCode: 422,
        detailedInfo: [
            {
                value: 'asds',
                property: "id",
                constraints: { isInt: 'wrong_value' },
            },
            {
                property: "title",
                constraints: { isNotEmpty: "cannot_be_empty", isString: 'wrong_value' },
            },
            {
                property: "price",
                constraints: { isNotEmpty: "cannot_be_empty", min: '1'},
            },
            {
                property: "category",
                constraints: { isNotEmpty: "cannot_be_empty", isEnum: 'wrong_value'},
            },
        ],
    })
    @Path('/:productId')
    @PUT
    @Security()
    @Tags('Products')
    public updateProduct(
        @PathParam('productId') productId: number,
        data: UpdateProductAid,
    ): Promise<ProductDto> {
        return this.productService.updateProduct(
            {
                ...data,
                id: productId
            }
        )
    }

    @Response<ErrorResponse>(409, "Product is not found error", {
        error: "productNotFound",
        statusCode: 409,
    })
    @Response<ErrorResponse>(422, "Validation error", {
        error: "validationError",
        statusCode: 422,
        detailedInfo: [
            {
                value: null,
                property: "id",
                constraints: { isInt: 'wrong_value' },
            }
        ],
    })
    @Path('/:productId')
    @DELETE
    @Security()
    @Tags('Products')
    public deleteProduct(
        @PathParam('productId') productId: number
    ): Promise<void> {
        return this.productService.deleteProduct({ id: productId })
    }
}