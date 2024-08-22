import { Server, Socket } from "socket.io";
import groupChatService from "../services/group-chat.service";

type Payload = {
  io: Server;
  socket: Socket;
  db: any; // remove any
};

class GroupChatController {
  createGroupChat({ socket, db }: Payload) {
    return async (payload: { name: string }, callback: Function) => {
      try {
        if (!callback || !(callback instanceof Function)) {
          return;
        }

        // TODO: add validation

        const group = await groupChatService.createGroupChat(payload, socket);

        return callback({
          status: "OK",
          data: group,
        });
      } catch (error) {
        return callback({
          status: "ERROR",
        });
      }
    };
  }
}

export default new GroupChatController();
