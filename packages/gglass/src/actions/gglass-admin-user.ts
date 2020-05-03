import { Action, ActionProcessor, api, config } from "actionhero";
import { model, gglassUser } from "../modules/gglass-user";

const commandPrefix = "admin:user:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor): Promise<void> {
    return Promise.resolve(undefined);
  }
}

// Actions
export class ListUserAction extends AdminAction {
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
    if (!!data.params.id) {
      data.response.users = await gglassUser.list(data.params.id);
    } else {
      data.response.users = await gglassUser.list();
    }
  }
}

export class CreateUserAction extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "Create a new user";
    this.inputs = {
      email: { required: true },
      password: { required: true },
      groups: { required: false },
    };
    this.outputExample = {};
  }

  async run(data) {
    let { created, user, error } = await gglassUser.create(
      data.params.email,
      data.params.password,
      data.params.groups || []
    );
    data.response.created = created;
    if (created) {
      data.response.user = user;
    } else {
      data.response.error = error;
    }
  }
}

export class UpdateUserAction extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "update";
    this.description = "Update a users profile";
    this.inputs = {
      id: { required: true },
      email: { required: false },
      password: { required: false },
      groups: { required: false },
    };
    this.outputExample = {};
  }

  async run(data) {
    let payload = {};
    Object.keys(this.inputs).forEach((attr) => {
      if (attr !== "id" && data.params[attr] !== undefined) {
        payload[attr] = data.params[attr];
      }
    });

    let { updated, user } = await gglassUser.update(data.params.id, payload);
    data.response.updated = updated;
    if (updated) {
      data.response.user = user;
    }
  }
}

export class DeleteUserAction extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a user";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }

  async run(data) {
    let { deleted } = await gglassUser.delete(data.params.id);
    data.response.deleted = deleted;
  }
}
