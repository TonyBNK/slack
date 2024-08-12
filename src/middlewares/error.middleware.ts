import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants";
import ApiError from "../exceptions/api.error";

export default function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .send({ message: err.message, errors: err.errors });
  }

  return res
    .status(HttpStatusCode.InternalServerError)
    .send({ message: "Unhandled error" });
}
