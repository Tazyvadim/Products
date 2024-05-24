import { IsDefined, IsNotEmpty, IsString} from "class-validator";
import { ValidationMsg } from "../../lib/validation-msg";

export class UserRegisterAid {
    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    login: string;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    name: string;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    password: string;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    passwordConfirm: string;
}

export class UserLoginAid {
    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    login: string;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    password: string;
}