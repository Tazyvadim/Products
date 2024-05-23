import "reflect-metadata";
import cors from "cors";
import express from "express";
import * as http from "http";
import morgan from "morgan";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { PassportAuthenticator, Server } from "typescript-rest";
import ErrorResponse from "./model/error-response";
import { UserUnauthorizedError } from "./lib/errors";
import { config } from "dotenv";
import { IApp } from "./lib/app.interface";
import { Container } from "typescript-ioc";
import iocConfig from "./ioc.config";
import { AppDataSource } from "./app-data-source";
import User from "./model/entity/user";

config({ path: ".env" });

export class ApiServer implements IApp {
  private readonly app: express.Application;
  public httpServer: http.Server = null;

  constructor() {
    Container.configure(...iocConfig);

    this.app = express();
    this.config();

    const apiRouter = express.Router();
    Server.loadServices(apiRouter, "controller/*", __dirname);
    this.app.use("/api/v1", apiRouter);

    Server.swagger(this.app, { filePath: "./dist/swagger.json" });

    // Error handler have to be configured last
    this.configureErrorHandler();

    this.httpServer = http.createServer(this.app);
  }

  /**
   * Start the server
   */
  public async start() {
    this.httpServer.listen(process.env.PORT, () => {
      console.log(`Http server started (http://127.0.0.1:${process.env.PORT})`);
    });
  }

  /**
   * Stop the server (if running).
   * @returns {Promise<boolean>}
   */
  public async stop(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.httpServer) {
        this.httpServer.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    });
  }

  /**
   * Configure the express app.
   */
  private config(): void {
    this.app.use(cors());
    this.app.use(morgan("combined"));
    this.configureAuthenticator();
  }

  private configureAuthenticator() {
    const jwtConfig: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET_KEY,
    };
    const strategy = new Strategy(
      jwtConfig,
      async (payload: any, done: (err: any, user: any) => void) => {
        let em = AppDataSource.manager;
        let user = await em.findOneBy(User, { id: payload.userId });
        if (!user) {
          done(new UserUnauthorizedError(), null);
        } else {
          done(null, user);
        }
      }
    );
    const authenticator = new PassportAuthenticator(strategy, {
      deserializeUser: (user: string) => JSON.parse(user),
      serializeUser: (user: any) => JSON.stringify(user),
    });
    Server.registerAuthenticator(authenticator);
  }

  /**
   * Configure error handler
   */
  private configureErrorHandler() {
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err) {
          console.error("ERROR");
          console.error(err.message);
          console.error(err.stack);

          let statusCode = 500;
          if (err.statusCode !== undefined) {
            statusCode = err.statusCode;
          }

          let errResp = new ErrorResponse();
          errResp.error = err.message;
          errResp.statusCode = statusCode;

          if (err.detailedInfo) {
            errResp.detailedInfo = err.detailedInfo;
          }

          res.status(statusCode).json(errResp);
        } else {
          next();
        }
      }
    );
  }
}
