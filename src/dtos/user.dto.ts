import { ObjectId } from "mongoose";

type ConstructorArgs = {
  email: string;
  id: ObjectId;
  isActivated: boolean;
};

class UserDto {
  email: string;
  id: string;
  isActivated: boolean;

  constructor({ email, id, isActivated }: ConstructorArgs) {
    this.email = email;
    this.id = String(id);
    this.isActivated = isActivated;
  }
}

export default UserDto;
