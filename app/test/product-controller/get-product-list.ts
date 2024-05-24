import axios from "axios";
import * as chai from "chai";
import { describe, it } from "mocha";
import { ApiServer } from "../../src/api-server";
import { AppDataSource } from "../../src/app-data-source";
import { createTestProduct, registerAndLoginUser } from "../common";
import { ProductCategory } from "../../src/lib/types";

const expect = chai.expect;

const apiServer: ApiServer = new ApiServer();

const apiRequest = axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api/v1`,
    validateStatus: null,
});

describe("Product controller tests - get product list GET /products", () => {
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
        const res = await apiRequest.get("/products", {});
        expect(res.status).to.eq(401);
    });

    it ("should validate input data", async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });
        const res = await apiRequest.get("/products", {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(200);
    });

    it ('should return product list', async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        const product1 = await createTestProduct({
            title: 'title1',
            price: 21,
            category: ProductCategory.SecondCategory,
            description: 'some descr'
        });

        const product2 = await createTestProduct({
            title: 'title2',
            price: 21,
            category: ProductCategory.SecondCategory,
        });

        let res = await apiRequest.get("/products", {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(200);
        expect(res.data).to.have.property('items');
        expect(res.data.items.length).to.deep.eq(2);
        expect(res.data).to.have.property('meta');
        expect(res.data.meta).to.deep.eq(
            {
                count: 2,
                pageNum: 1,
                pageSize: 20
            }
        );

        res = await apiRequest.get(`/products?title=title1`, {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(200);
        expect(res.data).to.have.property('items');
        expect(res.data.items.length).to.deep.eq(1);
        expect(res.data).to.have.property('meta');
        expect(res.data.meta).to.deep.eq(
            {
                count: 1,
                pageNum: 1,
                pageSize: 20
            }
        );
    });
});
