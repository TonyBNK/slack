import { v4 } from "uuid";
import db from "../db";

type CreationPayload = {
  name: string;
};

class GroupChatRepository {
  // TODO: remove any
  async createGroupChat({
    name,
  }: CreationPayload): Promise<{ id: string; name: string }> {
    // TODO: add db
    const groupChat = { id: v4(), name };
    db.groupChats.push(groupChat);

    return groupChat;
  }
}

export default new GroupChatRepository();
