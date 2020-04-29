import { Action, api, config } from "actionhero";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";
import { model } from "../modules/gglass-user";

const commandPrefix = "admin:user:";
const saltRounds = 5;
const hideAttributes = ["password"];

function omitKeysObject(obj, filter) {
  filter = !Array.isArray(filter) ? [filter] : filter;
  return typeof obj !== "object"
    ? obj
    : Object.keys(obj).reduce((o, k) => {
        if (filter.indexOf(k) === -1) {
          o[k] = obj[k];
        }
        return o;
      }, {});
}

function omitKeysCollection(collection, filter) {
  return collection.reduce((acc, cur) => {
    acc.push(omitKeysObject(cur, filter));
    return acc;
  }, []);
}

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
    await api.lowdb["user"].read(); // Sync DB
    if (!!data.params.id) {
      data.response.users = [
        await omitKeysObject(
          api.lowdb["user"].get("users").find({ id: data.params.id }).value(),
          hideAttributes
        ),
      ];
    } else {
      data.response.users = await omitKeysCollection(
        api.lowdb["user"].get("users").value(),
        hideAttributes
      );
    }
  }
}

// TODO: I should really just split this into insert/update... This was originally to save form logic on the frontend...
export class CreateUserAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "upsert";
    this.description = "Create a new user";
    this.inputs = {
      id: { required: false },
      email: { required: true },
      password: { required: false },
      groups: { required: false },
    };
    this.outputExample = {};
  }

  //TODO: Add admin-level validation

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
    if (data.params.id === "") {
      let userCheck = api.lowdb["user"]
        .get("users")
        .find({ email: data.params.email })
        .value();
      if (userCheck) {
        // Email exists
        data.response.created = false;
        data.response.error = "Email exists.";
      } else {
        // New user
        let newUser: model.user = {
          id: uuidv4(),
          email: data.params.email,
          password: await bcrypt.hash(data.params.password, saltRounds),
          groups: [],
        };
        if (
          Array.isArray(data.params.groups) &&
          data.params.groups.length > 0
        ) {
          data.params.groups.forEach((groupId) => {
            newUser.groups.push(groupId);
          });
        }
        let userCheck = api.lowdb["user"].get("users").push(newUser).write()[0];
        data.response.created = true;
        data.response.user = await omitKeysObject(userCheck, hideAttributes);
      }
    } else {
      console.log("EDIT!");
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
    data.response.deleted = false;
    await api.lowdb["user"].read(); // Sync DB

    data.response.entry = await api.lowdb["user"]
      .get("users")
      .remove({ id: data.params.id })
      .write()[0];

    if (!!data.response.entry) {
      data.response.deleted = true;
    }
  }
}
