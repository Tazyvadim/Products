import crypto from "crypto";
import { sign } from "jsonwebtoken";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserUnauthorizedError,
  WrongConfirmPasswordError,
  WrongPasswordError,
} from "../lib/errors";
import { ValidateParams } from "../lib/validation";
import User from "../model/entity/user";
import { AppDataSource } from "../app-data-source";
import { UserLoginAid, UserRegisterAid } from "../model/aids/auth.aids";
import { AuthInfoDto, UserRegisterInfoDto } from "../model/dtos/auth.dto";

export abstract class IAuthService {
  public abstract login(dto: UserLoginAid): Promise<AuthInfoDto>;
  public abstract register(dto: UserRegisterAid): Promise<UserRegisterInfoDto>;
  public abstract createToken(userId: number): string;
}

export class AuthService implements IAuthService {
  @ValidateParams(UserLoginAid)
  public async login(dto: UserLoginAid): Promise<AuthInfoDto> {
    const em = AppDataSource.manager;
    const user = await em.findOne(User, { where: { login: dto.login } });

    if (!user) {
      // for production app we shouldn't return error like this
      // just return wrongPasswordError or else (the same with wrong pass case)
      // cuz we can get some informations for hackers and etc.
      throw new UserNotFoundError();
    }

    const passMd5 = crypto.createHmac("md5", dto.password).digest("hex");
    if (passMd5 !== user.password) {
      throw new WrongPasswordError();
    }

    return {
      userUuid: user.uuid,
      authToken: this.createToken(user.id),
    };
  }

  @ValidateParams(UserRegisterAid)
  public async register(dto: UserRegisterAid): Promise<UserRegisterInfoDto> {
    const em = AppDataSource.manager;

    let user = await em.findOne(User, { where: { login: dto.login } });
    if (user) {
      throw new UserAlreadyExistsError();
    }

    if (dto.password !== dto.passwordConfirm) {
      throw new WrongConfirmPasswordError();
    }

    await em.transaction(async (manager) => {
      user = new User();
      user.login = dto.login;
      user.name = dto.name;
      user.password = crypto.createHmac("md5", dto.password).digest("hex");
      await manager.save(user);
    });

    return {
      login: user.login,
      uuid: user.uuid,
    };
  }

  public createToken(userId: number): string {
    const jwtOptions = {
      userId: userId,
    };
    return sign(jwtOptions, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}
