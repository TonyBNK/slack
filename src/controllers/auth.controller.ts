import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpStatusCode } from "../constants";
import ApiError from "../exceptions/api.error";
import authService from "../services/auth.service";
import { RequestWithBody } from "../types";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

class AuthController {
  async registration(
    req: RequestWithBody<{ email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      await authService.registration(req.body);

      res.sendStatus(HttpStatusCode.Success);
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: RequestWithBody<{ email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const data = await authService.login(req.body);

      res.status(HttpStatusCode.Success).send(data);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");

      res.sendStatus(HttpStatusCode.Success);
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.activate(req.params.link);

      res.redirect(CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const data = await authService.refresh(refreshToken);

      res.cookie("refreshToken", data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(HttpStatusCode.Success).send(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
