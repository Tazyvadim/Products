import {ValidationError} from "../errors";
import {validate} from "class-validator";

export function ValidateParams(...validArgs: any[]) {
    return function(target: any, key: any, descriptor: any) {
        if(descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            let totalErrors: Array<any> = [];
            for (let i = 0; i < args.length; i++) {
                if (validArgs[i]) {
                    
                    let argParts = [];
                    if (args[i] instanceof Array) {
                        argParts = args[i];
                    } else {
                        argParts.push(args[i]);
                    }

                    let _class = validArgs[i];
                    for (let arg of argParts) {
                        if (typeof arg !== 'number' && typeof arg !== 'string') {
                            let obj = new _class();
                            Object.assign(obj, arg);
                            const errors = await validate(obj, { 
                                //skipMissingProperties: true,
                                validationError: { target: false } 
                            });
    
                            if (errors.length > 0) {
                                errors.forEach(err => {
                                    totalErrors.push({
                                        value: err.value,
                                        property: err.property,
                                        constraints: err.constraints
                                    })    
                                })
                            }
                        }
                    }
                }
            }

            if (totalErrors.length > 0) {
                throw new ValidationError(totalErrors);
            }
            
            let result = await originalMethod.apply(this, args);
            return result;
        };
     
        return descriptor;
    }
}

export function validatePaginationParams(pageNum: number, pageSize: number) {
    let errors = []
    if (!Number.isInteger(pageNum) || pageNum <= 0) {
        errors.push({
            value: pageNum,
            property: "pageNum",
            constraints: { IsPageNum: "wrong_value" }
        })
    }

    if (!Number.isInteger(pageSize) || pageSize < 0) {
        errors.push({
            value: pageSize,
            property: "pageSize",
            constraints: { IsPageSize: "wrong_value" }
        })
    }

    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
}
