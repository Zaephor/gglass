import { Action, api, config } from "actionhero";
import { model } from "../modules/gglass-user";

const commandPrefix = "admin:settings:";

export class ListGroupAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "Lists all groups";
    this.inputs = {
      id: { required: false },
    };
    this.outputExample = {};
  }
  //TODO: Add admin-level validation

  async run(data) {
    await api.lowdb["settings"].read(); // Sync DB
  }
}
