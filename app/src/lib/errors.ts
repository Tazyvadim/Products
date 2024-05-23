abstract class BaseError extends Error {
  public detailedInfo: any;
  public statusCode: number;
}

export class UserUnauthorizedError extends BaseError {
  constructor() {
    super();
    this.statusCode = 401;
    this.message = "userUnauthorizedError";
  }
}

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = "userAlreadyExists";
  }
}

export class UserNotFoundError extends BaseError {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = "userNotFound";
  }
}

export class WrongPasswordError extends BaseError {
  constructor() {
    super();
    this.statusCode = 401;
    this.message = "wrongPasswordError";
  }
}

export class WrongConfirmPasswordError extends BaseError {
  constructor() {
    super();
    this.statusCode = 401;
    this.message = "wrongPasswordError";
  }
}
export class ValidationError extends BaseError {
  constructor(detailedInfo: any) {
    super();
    this.statusCode = 422;
    this.message = "validationError";
    this.detailedInfo = detailedInfo;
  }
}

export class ProductNotFoundError extends BaseError {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = "productNotFound";
  }
}
