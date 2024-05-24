import { Context, ServiceContext } from "typescript-rest";
import User from "../model/entity/user";

export default class BaseController {
    @Context
    protected context: ServiceContext;

    protected getUserIdFromAuthToken() {
        return this.context.request.user as User;
    }
}
