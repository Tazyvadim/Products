import { Inject } from "typescript-ioc";
import { Path, POST } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import ErrorResponse from "../model/error-response";
import { IAuthService } from "../service/auth-service";
import { UserLoginAid, UserRegisterAid } from "../model/aids/auth.aids";
import { AuthInfoDto, UserRegisterInfoDto } from "../model/dtos/auth.dto";

@Path("/")
export class AuthControlle {
  @Inject
  private authService: IAuthService;

  @Path("login")
  @POST
  @Tags("Authorization")
  @Response<ErrorResponse>(409, "User is not found error", {
    error: "userNotFound",
    statusCode: 409,
  })
  @Response<ErrorResponse>(409, "Wrong password error", {
    error: "wrongPasswordError",
    statusCode: 409,
  })
  @Response<ErrorResponse>(422, "Validation error", {
    error: "validationError",
    statusCode: 422,
    detailedInfo: [
      {
        property: "login",
        constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value' },
      },
      {
        property: "password",
        constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value' },
      },
    ],
  })
  public login(dto: UserLoginAid): Promise<AuthInfoDto> {
    return this.authService.login(dto);
  }

  @Path("logout")
  @POST
  @Tags("Authorization")
  public logout(): void {
    //
  }

  /**
   * Registration process for new user
   */
  @Response<ErrorResponse>(409, "User already exists error", {
    error: "userAlreadyExists",
    statusCode: 409,
  })
  @Response<ErrorResponse>(409, "Wrong confirm password error", {
    error: "wrongPasswordError",
    statusCode: 409,
  })
  @Response<ErrorResponse>(422, "Validation error", {
    error: "validationError",
    statusCode: 422,
    detailedInfo: [
      {
        property: "login",
        constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value' },
      },
      {
        property: "name",
        constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value' },
      },
      {
        property: "password",
        constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value' },
      },
      {
        property: "passwordConfirm",
        constraints: { isNotEmpty: 'cannot_be_empty', isString: 'wrong_value' },
      },
    ],
  })
  @Path("register")
  @POST
  @Tags("Registration")
  public register(dto: UserRegisterAid): Promise<UserRegisterInfoDto> {
    return this.authService.register(dto);
  }
}
