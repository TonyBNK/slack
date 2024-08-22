type GroupChat = {
  id: string;
  name: string;
};

type DB = {
  groupChats: Array<GroupChat>;
};

const db: DB = {
  groupChats: [
    { id: "1", name: "chat 1" },
    { id: "2", name: "chat 2" },
    { id: "3", name: "chat 3" },
  ],
};

export default db;
