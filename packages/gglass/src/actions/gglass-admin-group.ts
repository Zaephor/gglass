import { Action, ActionProcessor, api, config } from "actionhero";
import { model } from "../modules/gglass-user";

const commandPrefix = "admin:group:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor): Promise<void> {
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
    await api.lowdb["user"].read(); // Sync DB
    if (!!data.params.id) {
      data.response.groups = [
        api.lowdb["user"].get("groups").find({ id: data.params.id }).value(),
      ];
    } else {
      data.response.groups = api.lowdb["user"].get("groups").value();
    }
  }
}

// TODO: Upsert was because I'm lazy... Should probably split this too
export class CreateGroupAction extends AdminAction {
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
    await api.lowdb["user"].read(); // Sync DB

    let existingEntry: model.group = api.lowdb["user"]
      .get("groups")
      .find({ id: data.params.id })
      .value();
    if (!!existingEntry) {
      let update = {};
      Object.keys(this.inputs).forEach((attr) => {
        if (attr !== "id" && !!data.params[attr]) {
          update[attr] = data.params[attr];
        }
      });

      let result = await api.lowdb["user"]
        .get("groups")
        .find({ id: data.params.id })
        .assign(update)
        .write();
      if (!!result) {
        data.response.updated = true;
      }
    } else {
      let newEntry: model.group = {
        id: data.params.id,
      };
      Object.keys(this.inputs).forEach((attr) => {
        if (attr !== "id" && attr !== "label" && !!data.params[attr]) {
          newEntry[attr] = data.params[attr];
        }
      });
      let result = await api.lowdb["user"].get("groups").push(newEntry).write();
      if (!!result) {
        data.response.created = true;
      }
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
    data.response.deleted = false;
    await api.lowdb["user"].read(); // Sync DB

    if (data.params.id !== "admin") {
      data.response.entry = await api.lowdb["user"]
        .get("groups")
        .remove({ id: data.params.id })
        .write()[0];

      // TODO: Also remove group from all afflicted users
      if (!!data.response.entry) {
        data.response.deleted = true;
      }
    }
  }
}
