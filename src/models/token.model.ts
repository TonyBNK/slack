import { model, Schema } from "mongoose";

const Token = new Schema({
  refreshToken: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Token", Token);
