import { Action, ActionProcessor } from "actionhero";
import { gglassSettings } from "../modules/gglass-settings";

const commandPrefix = "admin:settings:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor<Action>): Promise<void> {
    return Promise.resolve(undefined);
  }
}

// Settings actions
export class ListSettings extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "Lists all settings";
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

export class UpdateSetting extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "update";
    this.description = "Update a site setting";
    this.inputs = {
      id: { required: true },
      value: { required: true },
    };
    this.outputExample = {};
  }

  async run(data) {
    let result = await gglassSettings.update(data.params.id, {
      value: data.params.value,
    });
    data.response.updated = result.updated;
  }
}

export class ResetSetting extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "reset";
    this.description = "Set a configuration setting back to default";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }

  async run(data) {
    let [entry] = await gglassSettings.list(data.params.id);
    delete entry.id;
    delete entry.value;
    let result = await gglassSettings.replace(data.params.id, entry);
    data.response.reset = result.reset;
  }
}
