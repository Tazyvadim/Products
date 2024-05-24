// emuns of Validatiom Message Erorrs
export enum ValidationMsg {
  NotUnique = 'not_unique',
  IsDefined = 'not_defined',
  NotFound = 'not_found',
  IsArray = 'not_array',
  IsEnum = 'wrong_value',
  IsMongoId = 'wrong_value',
  IsInt = 'wrong_value',
  IsBoolean = 'wrong_value',
  ValidateNested = 'nested_not_found',
  WrongValue = 'wrong_value',
  MaxLength = 'max_length',
  IsEmail = 'must_be_email',
  WrongPassword = 'wrong_password',
  CannotBeAmpty = 'cannot_be_empty'
}
