import { Action, api, config } from "actionhero";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

const commandPrefix = "admin:user";
const saltRounds = 5;

function omitKeys(obj, filter) {
  filter = !Array.isArray(filter) ? [filter] : filter;
  return typeof obj !== "object"
    ? obj
    : Object.keys(obj).reduce((o, k) => {
        if (filter.indexOf(k) === -1) {
          o[k] = obj[k];
        }
        return o;
      }, {});
}

export class ListUserAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "Lists all users";
    this.inputs = {
      id: { required: false },
    };
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
    if (!!data.params.id) {
      data.response.users = [
        api.lowdb["user"].get("users").find({ id: data.params.id }).value(),
      ];
    } else {
      data.response.users = api.lowdb["user"].get("users").value();
    }
  }
}

export class CreateUserAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "Create a new user";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
  }
}

export class DeleteUserAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a user";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
  }
}
