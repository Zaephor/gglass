import { Action, api, config } from "actionhero";
import { model } from "../modules/gglass-user";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

const commandPrefix = "admin:group:";

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

export class CreateGroupAction extends Action {
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
  //TODO: Add admin-level validation
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

export class DeleteGroupAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a group";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }
  //TODO: Add admin-level validation

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
