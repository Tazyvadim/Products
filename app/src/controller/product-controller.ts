import { Inject } from 'typescript-ioc';
import { DELETE, GET, Path, PathParam, POST, PUT, QueryParam, Security } from 'typescript-rest';
import { Response, Tags } from 'typescript-rest-swagger';
import ErrorResponse from '../model/error-response';
import BaseController from './base-controller';
import { AddProductAid, DeleteProductAid, UpdateProductAid } from '../model/aids/product.aids';
import { ProductDto, ProductDtoList } from '../model/dtos/products.dto';
import { IProductService } from '../service/product-service';

@Path('/products')
export class ProductController extends BaseController {
    @Inject
    private productService: IProductService;

    /**
     * Add new product
     */

    @Path('')
    @POST
    @Security()
    @Tags('Products')
    public addProduct(data: AddProductAid): Promise<ProductDto> {
        return this.productService.addProduct(data);
    }

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