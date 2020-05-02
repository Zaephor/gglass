import { Action, ActionProcessor, api, config } from "actionhero";
import { gglassSettings } from "../modules/gglass-settings";

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
    if (!!data.params.id) {
      data.response.settings = await gglassSettings.list(data.params.id);
    } else {
      data.response.settings = await gglassSettings.list();
    }
  }
}
