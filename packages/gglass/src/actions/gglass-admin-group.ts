import { Action, ActionProcessor, api, config } from "actionhero";
import { model, gglassGroup } from "../modules/gglass-user";
import { gglassMenu } from "../modules/gglass-menu";

const commandPrefix = "admin:group:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor<Action>): Promise<void> {
    return Promise.resolve(undefined);
  }
}

// Group admin actions
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
    data.response.groups = !!data.params.id
      ? await gglassGroup.list(data.params.id)
      : await gglassGroup.list();
  }
}

// TODO: Upsert was because I'm lazy... Should split to create/update/replace
export class UpsertGroupAction extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "upsert";
    this.description = "Create a new group";
    this.inputs = {
      id: { required: true },
      icon: { required: false },
    };
    this.outputExample = {};
  }
  //TODO: Restrict "id" input to alphanum only
  //TODO: Restrict "icon" input to alphanum only

  async run(data) {
    let [existingEntry] = await gglassGroup.list(data.params.id);
    if (!!existingEntry) {
      // Exists, update/replace
      let payload = {};
      if (!!data.params.icon) {
        payload["icon"] = data.params.icon;
      }
      return gglassGroup.replace(data.params.id, payload);
    } else {
      // New, create
      let payload = {
        id: data.params.id,
      };
      if (!!data.params.icon) {
        payload["icon"] = data.params.icon;
      }
      return gglassGroup.create(payload);
    }
  }
}

export class DeleteGroupAction extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a group";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }

  async run(data) {
    if (data.params.id !== "admin") {
      // TODO: Also remove group from all afflicted users
      data.response.deleted = await gglassGroup.delete(data.params.id);
    } else {
      data.response.deleted = false;
    }
  }
}
