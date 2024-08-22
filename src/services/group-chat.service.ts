import { Socket } from "socket.io";
import groupChatRepository from "../repositories/group-chat.repository";

type CreationPayload = {
  name: string;
};

class GroupChatService {
  // TODO: remove any
  async createGroupChat(
    payload: CreationPayload,
    socket: Socket
  ): Promise<void> {
    const groupChat = await groupChatRepository.createGroupChat(payload);

    this.broadcastGroupChatCreated(groupChat, socket);
  }

  private broadcastGroupChatCreated(
    groupChat: {
      id: string;
      name: string;
    },
    socket: Socket
  ) {
    socket.emit("group-chat:created", groupChat);
  }
}

export default new GroupChatService();
