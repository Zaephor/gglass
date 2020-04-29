//TODO: Split ah-lowdb-plugin off as it's own npm module
import { log, config, api } from "actionhero";
const FileSync = require("lowdb/adapters/FileSync");
import { db } from "./ah-lowdb-plugin";

export namespace model {
  export interface user {
    id: string;
    email: string;
    password: string;
    groups?: string[];
  }
  export interface group {
    id: string;
    // label: string;
    icon?: string;
  }
}

export const middleware = {
  "user:inject": {
    name: "user:inject",
    global: true,
    priority: 1100,
    preProcessor: async (data) => {
      data.user = false;
      if (data.session && data.session.data && data.session.data.id) {
        data.user = await api.lowdb["user"]
          .get("users")
          .find({ id: data.session.data.id })
          .value();
      }
    },
  },
};
