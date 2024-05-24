import axios from "axios";
import * as chai from "chai";
import { describe, it } from "mocha";
import { ApiServer } from "../../src/api-server";
import { AppDataSource } from "../../src/app-data-source";

const expect = chai.expect;

const apiServer: ApiServer = new ApiServer();

const apiRequest = axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api/v1`,
    validateStatus: null,
});

describe("Auth controller tests - registration user POST /register", () => {
    beforeEach(async () => {
        await AppDataSource.initialize();
        await apiServer.start();
    });

    afterEach(async () => {
        await AppDataSource.destroy();
        await apiServer.stop();
    });

    it ("should validate input data", async () => {
        const res = await apiRequest.post("/register", {});

        expect(res.status).to.eq(422);
        expect(res.data).to.deep.eq({
            error: "validationError",
            statusCode: 422,
            detailedInfo: [
                {
                    property: "login",
                    constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value'},
                },
                {
                    property: "name",
                    constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value'},
                },
                {
                    property: "password",
                    constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value'},
                },
                {
                    property: "passwordConfirm",
                    constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value'},
                },
            ],
        });
    });

    it ("should register new user if he is not exists", async () => {
        const res = await apiRequest.post("/register", {
            login: "login1",
            name: "name",
            password: '123',
            passwordConfirm: '123'
        });

        expect(res.status).to.eq(200);
        expect(res.data).to.have.property('login');
        expect(res.data.login).to.deep.eq('login1');
        expect(res.data).to.have.property('uuid');
    });

    it ("should throw error if user already exists", async () => {
        let res = await apiRequest.post("/register", {
            login: "login1",
            name: "name",
            password: '123',
            passwordConfirm: '123'
        });

        expect(res.status).to.eq(200);

        res = await apiRequest.post("/register", {
            login: "login1",
            name: "name2",
            password: '123',
            passwordConfirm: '123'
        });

        expect(res.data).to.deep.eq({
            error: "userAlreadyExists", statusCode: 409,
        });
    });
});
