import { ValidationError } from "express-validator";
import { HttpStatusCode } from "../constants";

class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: ValidationError[] = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static BadRequestError(message: string, errors: ValidationError[] = []) {
    return new ApiError(HttpStatusCode.BadRequest, message, errors);
  }

  static UnauthorizedError() {
    return new ApiError(HttpStatusCode.Unathorized, "User is not authorized");
  }

  static NotFoundError(message: string) {
    return new ApiError(HttpStatusCode.NotFound, message);
  }
}

export default ApiError;
