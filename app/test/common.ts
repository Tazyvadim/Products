import { UserRegisterAid } from "../src/model/aids/auth.aids";
import { AddProductAid } from "../src/model/aids/product.aids";
import { AuthInfoDto, UserRegisterInfoDto } from "../src/model/dtos/auth.dto";
import { ProductDto } from "../src/model/dtos/products.dto";
import { AuthService } from "../src/service/auth-service";
import { ProductService } from "../src/service/product-service";

export async function registerUser(data: UserRegisterAid): Promise<UserRegisterInfoDto> {
    const authService = new AuthService();
    return await authService.register({...data});
}

export async function registerAndLoginUser(data: UserRegisterAid): Promise<AuthInfoDto> {
    const authService = new AuthService();
    await authService.register({...data});

    const authInfo = await authService.login({
        login: data.login,
        password: data.password,
    });

    return authInfo;
}

export async function createTestProduct(data: AddProductAid): Promise<ProductDto> {
    const productService = new ProductService();
    return await productService.addProduct({...data});
}