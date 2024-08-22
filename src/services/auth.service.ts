import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { v4 } from "uuid";
import UserDto from "../dtos/user.dto";
import ApiError from "../exceptions/api.error";
import mailService from "./mail.service";
import tokenService from "./token.service";
import userService from "./user.service";

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
    const isUserExist = await userService.fetchUser({ email });

    if (isUserExist) {
      throw ApiError.BadRequestError(`User with email ${email} already exists`);
    }

    const activationLink = v4();

    await userService.createUser({ email, password, activationLink });

    await mailService.sendActivationLink(email, activationLink);
  }

  async login({ email, password }: Payload): Promise<LoginResponse | Error> {
    const user = await userService.fetchUser({ email });
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
    const user = await userService.fetchUser({ activationLink: link });

    if (!user) {
      throw ApiError.BadRequestError("Such user does not exist");
    }

    await userService.activateUser(user);
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

    const user = await userService.fetchUser({
      id: (tokenData as JwtPayload).id,
    });

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
