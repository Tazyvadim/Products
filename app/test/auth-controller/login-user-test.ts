import axios from "axios";
import * as chai from "chai";
import { describe, it } from "mocha";
import { ApiServer } from "../../src/api-server";
import { AppDataSource } from "../../src/app-data-source";
import { registerUser } from "../common";

const expect = chai.expect;

const apiServer: ApiServer = new ApiServer();

const apiRequest = axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api/v1`,
    validateStatus: null,
});

describe("Auth controller tests - login user POST /login", () => {
    beforeEach(async () => {
        await AppDataSource.initialize();
        await apiServer.start();
    });

    afterEach(async () => {
        await AppDataSource.destroy();
        await apiServer.stop();
    });

    it ("should validate input data", async () => {
        const res = await apiRequest.post("/login", {});

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
                    property: "password",
                    constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value'},
                },
            ],
        });
    });

    it ("should check is user registered", async () => {
        const res = await apiRequest.post("/login", {
            login: "login1",
            password: '123'
        });

        expect(res.status).to.eq(409);
        // for production app we shouldn't return error like this
        // just return wrongPasswordError or else
        // cuz we can get some informations for hackers and etc.
        expect(res.data).to.deep.eq({ error: "userNotFound", statusCode: 409 });
    });

    it ("should throw error if password is wrong", async () => {
        await registerUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        const res = await apiRequest.post("/login", {
            login: "login1",
            password: '132'
        });

        expect(res.status).to.eq(409);
        expect(res.data).to.deep.eq({ error: "wrongPasswordError", statusCode: 409 });
    });


    it ('shoul login user', async () => {
        await registerUser({
            login: 'login1',
            name: 'name1',
            password: '123',
            passwordConfirm: '123'
        });

        const res = await apiRequest.post("/login", {
            login: "login1",
            password: '123'
        });

        expect(res.status).to.eq(200);
        expect(res.data).to.have.property('userUuid');
        expect(res.data).to.have.property('authToken');
    });
});