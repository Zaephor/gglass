import { Action, api, config } from "actionhero";
import { gglassUser } from "../modules/gglass-user";
import { session } from "../modules/ah-session-plugin";
import { gglassSettings } from "../modules/gglass-settings";

const commandPrefix = "user:";

// TODO: Consider other auth login flows
// TODO: Add API to let user delete self

// Main user functions
export class WhoAmIAction extends Action {
  user_logged_in = false;

  constructor() {
    super();
    this.name = commandPrefix + "whoami";
    this.description = "Determine who I am";
    this.logLevel = "debug";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    data.response.session = data.session;
    data.response.user = data.user;
  }
}

export class EnabledAuth extends Action {
  user_logged_in = false;

  constructor() {
    super();
    this.name = commandPrefix + "enabled";
    this.description = "List what logins/registrations are enabled";
    this.logLevel = "debug";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    let userCount = await gglassUser.count();

    // Can always login
    data.response.login = true;

    // Conditional registration
    let register = (await gglassSettings.list("user_registration"))[0];

    data.response.register =
      userCount === 0 ||
      (register["value"] !== undefined
        ? register["value"]
        : register["default_value"]);

    // Gauth section
    // Gauth in general
    let gauthLogin = (await gglassSettings.list("user_gauth_login"))[0];
    data.response.gauth_login =
      gauthLogin["value"] !== undefined
        ? gauthLogin["value"]
        : gauthLogin["default_value"];
    // Block new Gauth registrations
    let gauthRegister = (
      await gglassSettings.list("user_gauth_registration")
    )[0];
    data.response.gauth_register =
      gauthRegister["value"] !== undefined
        ? gauthRegister["value"]
        : gauthRegister["default_value"];
  }
}

export class LoginProfileAction extends Action {
  user_logged_in = false;

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
      password: { required: true },
    };
    this.outputExample = {
      user: {
        id: "31a16712-a33e-464f-a6bb-43cdb87fde32",
        email: "user@email.com",
        groups: ["user"],
      },
    };
  }

  async run(data) {
    if (!!data.session || !!data.user) {
      throw new Error("Already logged in.");
    }
    let userProfile = await gglassUser.login(
      data.params.email,
      data.params.password
    );
    if (!!userProfile) {
      await session.create(data.connection, userProfile);
      data.response.user = userProfile;
    } else {
      data.response.user = false;
      data.response.error = "Credentials invalid.";
    }
  }
}

// TODO: Enable/Disable if permitted in configuration
// TODO: Always activate if user table is empty
export class RegisterProfileAction extends Action {
  user_logged_in = false;

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
    let [registrationSetting] = await gglassSettings.list("user_registration");
    let userCount = await gglassUser.count();
    if (
      userCount > 0 &&
      (registrationSetting["value"] !== undefined
        ? registrationSetting["value"]
        : registrationSetting["default_value"]) === false
    ) {
      throw new Error("Registration has been disabled.");
    }
    if (!!data.session || !!data.user) {
      throw new Error("Already logged in.");
    }
    let { created, user, error } = await gglassUser.create(
      data.params.email,
      data.params.password
    );
    data.response.created = created;
    if (created) {
      data.response.user = user;
      await session.create(data.connection, user);
    } else {
      data.response.error = error;
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
      // let cookieName = config.servers.web.fingerprintOptions.cookieKey;
      // let oldDate = new Date(1).toUTCString();
      // // data.connection.rawConnection.responseHeaders.push([
      //   "Set-Cookie",
      //   cookieName + "=X; expires=" + oldDate + "; path=/",
      // ]);
    } else {
      data.response.success = false;
      data.response.error = "Not logged in.";
    }
  }
}
