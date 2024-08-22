import { Document, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink?: string;
}

const User = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});

export default model("User", User);
