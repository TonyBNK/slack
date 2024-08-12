import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { v4 } from "uuid";
import UserDto from "../dtos/user.dto";
import ApiError from "../exceptions/api.error";
import User from "../models/user.model";
import mailService from "./mail.service";
import tokenService from "./token.service";

type Payload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    isActivated: boolean;
  };
};

class AuthService {
  async registration({ email, password }: Payload): Promise<void | Error> {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      throw ApiError.BadRequestError(`User with email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = v4();

    const user = new User({ email, password: hashedPassword, activationLink });
    await user.save();

    await mailService.sendActivationLink(email, activationLink);
  }

  async login({ email, password }: Payload): Promise<LoginResponse | Error> {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.NotFoundError(`User with email ${email} does not exist`);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ApiError.BadRequestError("Wrong password");
    }

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    const { accessToken, refreshToken } = tokenService.generateTokens({
      ...userDto,
    });
    await tokenService.saveToken(refreshToken, userDto.id);

    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    await tokenService.removeToken(refreshToken);
  }

  async activate(link: string) {
    const user = await User.findOne({ activationLink: link });

    if (!user) {
      throw ApiError.BadRequestError("Such user does not exist");
    }

    user.isActivated = true;
    await user.save();
  }

  async refresh(token: string) {
    if (!token) {
      throw ApiError.UnauthorizedError();
    }

    const tokenData = tokenService.validateRefreshToken(token);
    const tokenFromDb = await tokenService.findRefreshToken(token);

    if (!tokenData || tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById((tokenData as JwtPayload).id);

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    const { accessToken, refreshToken } = tokenService.generateTokens({
      ...userDto,
    });
    await tokenService.saveToken(refreshToken, userDto.id);

    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }
}

export default new AuthService();
