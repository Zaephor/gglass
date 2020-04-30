import { Action, api, config } from "actionhero";
import { model, gglassUser } from "../modules/gglass-user";

const commandPrefix = "admin:user:";

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

  //TODO: Add admin-level validation

  async run(data) {
    if (!!data.params.id) {
      data.response.users = await gglassUser.list(data.params.id);
    } else {
      data.response.users = await gglassUser.list();
    }
  }
}

export class CreateUserAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "insert";
    this.description = "Create a new user";
    this.inputs = {
      email: { required: true },
      password: { required: true },
      groups: { required: false },
    };
    this.outputExample = {};
  }

  //TODO: Add admin-level validation

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

export class UpdateUserAction extends Action {
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

  //TODO: Add admin-level validation

  async run(data) {
    let { updated, user } = await gglassUser.update(
      data.params.id,
      data.params
    );
    data.response.updated = updated;
    if (updated) {
      data.response.user = user;
    }
  }
}

export class DeleteUserAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a user";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }

  //TODO: Add admin-level validation

  async run(data) {
    let { deleted } = await gglassUser.delete(data.params.id);
    data.response.deleted = deleted;
  }
}
