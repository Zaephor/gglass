import { Action, api, config } from "actionhero";
import { model } from "../modules/gglass-user";
import { session } from "../modules/ah-session-plugin";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

const commandPrefix = "user:";
const saltRounds = 5;

function omitKeys(obj, filter) {
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

// User management actions
// TODO: Require admin permission to use this function
export class CreateProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "Create a new user";
    this.inputs = {
      email: {
        //TODO: Email format validation
        required: true,
        formatter: (param, connection, actionTemplate) => {
          return param.toString().toLowerCase();
        },
      },
      password: { required: true }, //TODO: Password validation(length)
    };
    this.outputExample = {
      created: true,
      userId: "4b08842c-fe7f-49f5-8dbc-07248e6a88aa",
    };
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
    // Find user by email
    let userCheck = api.lowdb["user"]
      .get("users")
      .find({ email: data.params.email })
      .value();
    // Get count of user
    let userCount = api.lowdb["user"].get("users").size().value();

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
      // Add user to admin group if no users exist
      if (userCount === 0) {
        newUser.groups.push("admin");
      }
      let userCheck = api.lowdb["user"].get("users").push(newUser).write()[0];
      data.response.created = true;
      // data.response.userId = userId;
      data.response.user = await omitKeys(userCheck, ["password"]);
    }
  }
}

export class UpdateProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "update";
    this.description = "Update an existing user";
    this.inputs = {
      id: { required: true }, //TODO: UserID lookup and validation
      email: { required: false }, //TODO: Email format validation
      password: { required: false }, //TODO: Password validation and encryption
      groups: { required: false }, //TODO: Change group memberships
    };
    this.outputExample = {};
  }

  async run(data) {
    data.response.ok = true;
  }
}

export class WhoAmIAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "whoami";
    this.description = "Determine who I am";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    data.response.session = data.session;
    data.response.user = await omitKeys(data.user, ["password"]);
    // data.response.user = data.user;
  }
}

export class GetProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "get";
    this.description = "Return user profile";
    this.outputExample = {};
  }

  async run(data) {
    data.response.ok = true;
  }
}

export class GetProfileListAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "Return list of users";
    this.outputExample = {};
  }

  async run(data) {
    data.response.ok = true;
  }
}

export class DeleteProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a user";
    this.outputExample = {};
  }

  async run(data) {
    data.response.ok = true;
  }
}

// User session actions

export class LoginProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "login";
    this.description = "Perform a user login";
    this.inputs = {
      email: {
        required: true,
        formatter: (param, connection, actionTemplate) => {
          return param.toString().toLowerCase();
        },
      },
      password: { required: true }, //TODO: Password validation and hashing
    };
    this.outputExample = {
      userId: "31a16712-a33e-464f-a6bb-43cdb87fde32",
    };
  }

  async run(data) {
    api.lowdb["user"].read(); // Sync DB
    // Find user by email
    let userCheck = await api.lowdb["user"]
      .get("users")
      .find({ email: data.params.email })
      .value();
    data.response.userId = false; // Predefine as false
    if (!userCheck) {
      // No user found
      data.response.error = "Credentials invalid.";
    } else {
      // Compare password using bcrypt
      let validPassword = await bcrypt.compare(
        data.params.password,
        userCheck.password
      );
      if (!validPassword) {
        // Password invalid
        data.response.error = "Credentials invalid.";
      } else {
        // Password valid, attach to user session
        await session.create(
          data.connection,
          await omitKeys(userCheck, ["password"])
        );
        // data.response.userId = userCheck.id;
        data.response.user = await omitKeys(userCheck, ["password"]);
      }
    }
  }
}

// TODO: Enable/Disable if permitted in configuration
// TODO: Block logged in users from using this
// TODO: Always activate if user table is empty
export class RegisterProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "register";
    this.description = "Register and login as a new user";
    this.inputs = {
      email: {
        //TODO: Email format validation
        required: true,
        formatter: (param, connection, actionTemplate) => {
          return param.toString().toLowerCase();
        },
      },
      password: { required: true }, //TODO: Password validation(length)
    };
    this.outputExample = {
      created: true,
      userId: "4b08842c-fe7f-49f5-8dbc-07248e6a88aa",
    };
  }

  async run(data) {
    await api.lowdb["user"].read(); // Sync DB
    // Find user by email
    let userCheck = api.lowdb["user"]
      .get("users")
      .find({ email: data.params.email })
      .value();
    // Get count of user
    let userCount = api.lowdb["user"].get("users").size().value();

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
      // Add user to admin group if no users exist
      if (userCount === 0) {
        newUser.groups.push("admin");
      }
      let userCheck = api.lowdb["user"].get("users").push(newUser).write()[0];
      data.response.created = true;
      data.response.user = await omitKeys(userCheck, ["password"]);
      await session.create(
        data.connection,
        await omitKeys(userCheck, ["password"])
      );
      // data.response.userId = userId;
    }
  }
}

export class LogoutProfileAction extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "logout";
    this.description = "Perform a user logout";
    this.inputs = {};
    this.outputExample = {
      success: false,
      error: "Not logged in.",
    };
  }

  async run(data) {
    if (data.session !== false) {
      data.response.success = await session.destroy(data.connection);
      let cookieName = config.servers.web.fingerprintOptions.cookieKey;
      let oldDate = new Date(1).toUTCString();
      data.connection.rawConnection.responseHeaders.push([
        "Set-Cookie",
        cookieName + "=X; expires=" + oldDate + "; path=/",
      ]);
    } else {
      data.response.success = false;
      data.response.error = "Not logged in.";
    }
  }
}
