import axios from "axios";
import * as chai from "chai";
import { describe, it } from "mocha";
import { ApiServer } from "../../src/api-server";
import { AppDataSource } from "../../src/app-data-source";
import { createTestProduct, registerAndLoginUser } from "../common";
import { ProductCategory } from "../../src/lib/types";
import Product from "../../src/model/entity/product";

const expect = chai.expect;

const apiServer: ApiServer = new ApiServer();

const apiRequest = axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api/v1`,
    validateStatus: null,
});

describe("Product controller tests - delete product by id Delete /products/:productId", () => {
    beforeEach(async () => {
        await AppDataSource.initialize();
        await apiServer.start();
    });
    
    afterEach(async () => {
        await AppDataSource.destroy();
        await apiServer.stop();
    });
    
    it ("should check auth", async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });
        const res = await apiRequest.delete("/products/1", {});
        expect(res.status).to.eq(401);
    }); 

    it ("should validate input data", async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });
        let res = await apiRequest.get("/products/dasd", {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(422);
        expect(res.data).to.deep.eq({
            error: "validationError",
            statusCode: 422,
            detailedInfo: [
                {
                    value: null,
                    property: "id",
                    constraints: { isInt: 'wrong_value' },
                },
            ],
        });
    });

    it ('should throw error if product not found', async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        let res = await apiRequest.delete("/products/1", {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(409);
        expect(res.data).to.deep.eq({ error: 'productNotFound', statusCode: 409 });
    });

    it ('should delete product', async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        const product = await createTestProduct({
            title: 'title1',
            price: 21,
            category: ProductCategory.SecondCategory,
            description: 'some descr'
        });

        let res = await apiRequest.delete(`/products/${product.id}`, {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(204);
        
        const em = AppDataSource.manager
        const products = await em.find(Product, {})

        expect(products.length).to.deep.eq(0)
    });
});
