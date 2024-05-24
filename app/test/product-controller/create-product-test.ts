import axios from "axios";
import * as chai from "chai";
import { describe, it } from "mocha";
import { ApiServer } from "../../src/api-server";
import { AppDataSource } from "../../src/app-data-source";
import { registerAndLoginUser } from "../common";
import { ProductCategory } from "../../src/lib/types";

const expect = chai.expect;

const apiServer: ApiServer = new ApiServer();

const apiRequest = axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api/v1`,
    validateStatus: null,
});

describe("Product controller tests - create product POST /products", () => {
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
        const res = await apiRequest.post("/products", {});
        expect(res.status).to.eq(401);
    });

    it ("should validate input data", async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        let res = await apiRequest.post("/products", {}, {
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

        res = await apiRequest.post("/products", {
            description: 123
        }, {
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
                    property: "description",
                    constraints: { isString: 'wrong_value'},
                    value: 123
                }
            ],
        });
    });

    it ('should create new product', async () => {
        const authInfo = await registerAndLoginUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        let res = await apiRequest.post("/products", {
            title: 'product1',
            price: 123,
            category: ProductCategory.FirstCategory
        }, {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(200);
        expect(res.data).to.have.property("id");
        expect(res.data).to.have.property("createdAt");
        delete res.data.id;
        delete res.data.createdAt;
        expect(res.data).to.deep.eq({
            title: 'product1',
            price: 123,
            category: ProductCategory.FirstCategory,
            description: null
        });

        res = await apiRequest.post("/products", {
            title: 'product2',
            price: 3123,
            category: ProductCategory.SecondCategory,
            description: 'some desctiption'
        }, {
            headers: {
                Authorization: authInfo.authToken,
            },
        });

        expect(res.status).to.eq(200);
        expect(res.data).to.have.property("id");
        expect(res.data).to.have.property("createdAt");
        delete res.data.id;
        delete res.data.createdAt;
        expect(res.data).to.deep.eq({
            title: 'product2',
            price: 3123,
            category: ProductCategory.SecondCategory,
            description: 'some desctiption'
        });
    });
});