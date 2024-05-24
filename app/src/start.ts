import { ApiServer } from "./api-server";
import {config} from "dotenv"
import { AppDataSource } from "./app-data-source";

export async function start(): Promise<void> {
    config({path: ".env"});
    await AppDataSource.initialize();
    
    let graceful: any = null;

    console.log("APP_MODE: " + process.env.APP_MODE);

    //if need add one or more instance (worker, cron) we can change APP_MODE
    if (process.env.APP_MODE.toLowerCase() === "api") {
        console.log("start api");

        const apiServer = new ApiServer();
        await apiServer.start();
    
        graceful = async () => {
            await apiServer.stop();
            process.exit(0);
        };
    }
    // Stop graceful
    process.on("SIGTERM", graceful);
    process.on("SIGINT", graceful);
}
