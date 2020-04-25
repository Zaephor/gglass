import { Action, api, config } from "actionhero";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

const commandPrefix = "admin:group";

export class ListGroupAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "Lists all groups";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
  }
}

export class CreateGroupAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "Create a new group";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
  }
}

export class DeleteGroupAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a group";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
    // Also remove group from all afflicted users
  }
}
