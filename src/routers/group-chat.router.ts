import { Server, Socket } from "socket.io";
import groupChatController from "../controllers/group-chat.controller";

class GroupChatRouter {
  // TODO: remove any
  setupRoutes(io: Server, db: any) {
    io.of("/groups").on("connection", (socket: Socket) => {
      socket.on(
        "group-chat:create",
        groupChatController.createGroupChat({ io, socket, db })
      );
    });
  }
}

export default new GroupChatRouter();
