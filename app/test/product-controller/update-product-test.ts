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

describe("Product controller tests - update product PUT /products/:productId", () => {
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
        const res = await apiRequest.put("/products/1", {});
        expect(res.status).to.eq(401);
    });

    it ("should validate input data", async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });
        const res = await apiRequest.put("/products/dasd", {}, {
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
        });
    });

    it ('should return error when product not found', async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        const res = await apiRequest.put("/products/1", {
            title: 'title2',
            price: 231,
            category: ProductCategory.FirstCategory
        }, {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(409);
        expect(res.data).to.deep.eq({ error: "productNotFound", statusCode: 409 });
    });

    it ('should update product', async () => {
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

        const res = await apiRequest.put(`/products/${product.id}`, {
            title: 'title2',
            price: 231,
            category: ProductCategory.SecondCategory,
            description: null,
        }, {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(200);

        const em = AppDataSource.manager;
        const [productFromDb, ...entities] = await em.find(Product, {});

        expect(productFromDb).to.have.property('createdAt');
        delete productFromDb.createdAt;
        expect(productFromDb).to.deep.eq({
            id: product.id,
            title: 'title2',
            price: 231,
            category: ProductCategory.SecondCategory,
            description: null,
        });
    });
});