import { Inject } from 'typescript-ioc';
import { Path, POST } from 'typescript-rest';
import { Response, Tags } from 'typescript-rest-swagger';
import ErrorResponse from '../model/error-response';
import { IAuthService } from '../service/auth-service';
import { UserLoginAid, UserRegisterAid } from '../model/aids/auth.aids';
import { AuthInfoDto, UserRegisterInfoDto } from '../model/dtos/auth.dto';

@Path('/')
export class AuthControlle {
    @Inject
    private authService: IAuthService

    @Path('login')
    @POST
    @Tags('Authorization')
    public login(dto: UserLoginAid): Promise<AuthInfoDto> {
        return this.authService.login(dto);
    }

    @Path('logout')
    @POST
    @Tags('Authorization')
    public logout(): void {
      //
    }

    /**
     * Registration process for new user
     */
    @Path('register')
    @POST
    @Tags('Registration')
    public register(dto: UserRegisterAid): Promise<UserRegisterInfoDto> {
        return this.authService.register(dto);
      }
}