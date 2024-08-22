import bcrypt from "bcrypt";
import { UserDocument } from "../models/user.model";
import userRepository from "../repositories/user.repository";

type FetchParameters = {
  id?: string;
  email?: string;
  activationLink?: string;
};

type CreationPayload = {
  email: string;
  password: string;
  activationLink: string;
};

class UserService {
  async createUser({
    email,
    password,
    activationLink,
  }: CreationPayload): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);

    await userRepository.createUser({
      email,
      password: hashedPassword,
      activationLink,
    });
  }

  async fetchUser({
    id,
    email,
    activationLink,
  }: FetchParameters): Promise<UserDocument | null> {
    if (id) {
      return userRepository.getUserById(id);
    }

    if (email) {
      return userRepository.getUserByEmail(email);
    }

    if (activationLink) {
      return userRepository.getUserByActivationLink(activationLink);
    }

    return null;
  }

  async activateUser(user: UserDocument): Promise<void> {
    await userRepository.updateUser(user, { isActivated: true });
  }
}

export default new UserService();
