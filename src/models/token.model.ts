import { Document, model, Schema } from "mongoose";

export interface TokenDocument extends Document {
  refreshToken: string;
  user: typeof Schema.Types.ObjectId;
}

const Token = new Schema<TokenDocument>({
  refreshToken: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Token", Token);
