import { IsDefined, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { ValidationMsg } from "../../lib/validation-msg";
import { ProductCategory } from "../../lib/types";

export class AddProductAid {
    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    title: string;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @Min(1, {message: '1' })
    price: number;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsEnum(ProductCategory, { message: ValidationMsg.IsEnum })
    category: ProductCategory;

    @IsOptional()
    @IsString({ message: ValidationMsg.WrongValue })
    description?: string;
    
}

export class UpdateProductAid {
    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsInt({ message: ValidationMsg.IsInt })
    id: number;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsString({message: ValidationMsg.WrongValue})
    title: string;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @Min(1, {message: '1' })
    price: number;

    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsEnum(ProductCategory, { message: ValidationMsg.IsEnum })
    category: ProductCategory;

    @IsOptional()
    @IsString({ message: ValidationMsg.WrongValue })
    description?: string;
}

export class GetProductAid {
    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsInt({ message: ValidationMsg.IsInt })
    id: number;
}

export class GetProductListAid {
    pageNum: number;

    pageSize: number;

    @IsOptional()
    @IsString({ message: ValidationMsg.WrongValue })
    title?: string;
}

export class DeleteProductAid {
    @IsNotEmpty({ message: ValidationMsg.CannotBeAmpty })
    @IsInt({ message: ValidationMsg.IsInt })
    id: number;
}