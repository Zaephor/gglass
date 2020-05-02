import { Action, ActionProcessor, api, config } from "actionhero";
import { model } from "../modules/gglass-user";

const commandPrefix = "admin:settings:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor): Promise<void> {
    return Promise.resolve(undefined);
  }
}

// Settings actions
export class ListGroupAction extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "Lists all groups";
    this.inputs = {
      id: { required: false },
    };
    this.outputExample = {};
  }

  async run(data) {
    await api.lowdb["settings"].read(); // Sync DB
  }
}
