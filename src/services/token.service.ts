import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Token from "../models/token.model";

dotenv.config();

const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "000";
const SECRET_REFRESH_KEY = process.env.SECRET_REFRESH_KEY || "000";

type Payload = {
  email: string;
  id: string;
  isActivated: boolean;
};

class TokenService {
  generateTokens(payload: Payload) {
    const accessToken = jwt.sign(payload, SECRET_ACCESS_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, SECRET_REFRESH_KEY, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(refreshToken: string, userId: string) {
    let token = await Token.findOne({ user: userId });

    if (token) {
      token.refreshToken = refreshToken;
    } else {
      token = new Token({ refreshToken, user: userId });
    }

    await token.save();

    return token;
  }

  async removeToken(refreshToken: string) {
    await Token.deleteOne({ refreshToken });
  }

  validateAccessToken(token: string) {
    try {
      return jwt.verify(token, SECRET_ACCESS_KEY);
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      return jwt.verify(token, SECRET_REFRESH_KEY);
    } catch (error) {
      return null;
    }
  }

  async findRefreshToken(refreshToken: string) {
    return Token.findOne({ refreshToken });
  }
}

export default new TokenService();
