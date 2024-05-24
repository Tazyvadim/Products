import { Scope } from "typescript-ioc";
import { AuthService, IAuthService } from "./service/auth-service";
import { IProductService, ProductService } from "./service/product-service";
export default  [
    { bind: IAuthService, to: AuthService, scope: Scope.Singleton },
    { bind: IProductService, to: ProductService, scope: Scope.Singleton },
];