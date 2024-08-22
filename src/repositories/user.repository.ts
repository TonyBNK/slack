import User, { UserDocument } from "../models/user.model";

type CreationPayload = {
  email: string;
  password: string;
  activationLink: string;
};
type UpdatingPayload = {
  email?: string;
  password?: string;
  isActivated?: boolean;
  activationLink?: string;
};

class UserRepository {
  async createUser({
    email,
    password,
    activationLink,
  }: CreationPayload): Promise<void> {
    const user = new User({ email, password, activationLink });
    await user.save();
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  async getUserByActivationLink(
    activationLink: string
  ): Promise<UserDocument | null> {
    return User.findOne({ activationLink });
  }

  async updateUser(
    user: UserDocument,
    payload: UpdatingPayload
  ): Promise<void> {
    Object.keys(payload).forEach((key) => {
      user.set(
        key as keyof UserDocument,
        payload[key as keyof UpdatingPayload]
      );
    });

    await user.save();
  }
}

export default new UserRepository();
