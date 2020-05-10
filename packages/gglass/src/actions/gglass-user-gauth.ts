import { Action } from "actionhero";
import { gglassUser, util as gglassUserUtil } from "../modules/gglass-user";
import { gglassSettings } from "../modules/gglass-settings";
import { session } from "../modules/ah-session-plugin";

const commandPrefix = "user:google:";

// Google Auth Flow
// TODO: Check for possible error flows
export class GoogleAuth extends Action {
  user_logged_in = false;

  constructor() {
    super();
    this.name = commandPrefix + "auth";
    this.description = "First phase of Google Oauth";
    // this.logLevel = "debug";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    let [googleLogin] = await gglassSettings.list("user_gauth_login");
    if (googleLogin.value === true) {
      let gauth_url = await gglassUserUtil.google.authUrl(
        data.connection.rawConnection.req.headers.host
      );
      if (data.connection.type === "web") {
        data.connection.rawConnection.responseHeaders.push([
          "Location",
          gauth_url,
        ]);
        data.connection.setStatusCode(302);
      }
    } else {
      data.response.error = "Login via Google auth is disabled.";
    }
  }
}

// TODO: Check for possible error flows
export class GoogleAuthCallback extends Action {
  user_logged_in = false;

  constructor() {
    super();
    this.name = commandPrefix + "callback";
    this.description = "Second phase of Google Oauth";
    // this.logLevel = "debug";
    this.inputs = {
      code: { required: true },
      scope: { required: false },
      state: { required: false },
    };
    this.outputExample = {};
  }

  async run(data) {
    let gauthResult = await gglassUserUtil.google.callback(
      data.connection.rawConnection.req.headers.host,
      data.params.code
    );
    if (!!gauthResult && !!gauthResult.email) {
      let userCheck = await gglassUser.find(gauthResult.email);
      if (!userCheck) {
        // User doesn't exist, create if enabled
        let [googleRegistration] = await gglassSettings.list(
          "user_gauth_registration"
        );
        if (googleRegistration.value === true) {
          let userResult = await gglassUser.create(
            gauthResult.email,
            gauthResult.id
          );
          if (userResult.created) {
            userCheck = userResult.user;
          } else {
            data.response.error = userResult.error;
          }
        } else {
          data.response.error = "Registration via Google auth is disabled.";
        }
      }
      // User exists, login if google login is enabled
      let [googleLogin] = await gglassSettings.list("user_gauth_login");
      if (googleLogin.value !== true) {
        data.response.error = "Login via Google auth is disabled.";
      } else {
        if (!!userCheck) {
          await session.create(data.connection, userCheck);
          data.response.user = userCheck;
          if (data.connection.type === "web") {
            data.connection.rawConnection.responseHeaders.push([
              "Location",
              "/",
            ]);
            data.connection.setStatusCode(302);
          }
        } else {
          data.response.user = false;
          data.response.error = "Not sure.";
        }
      }
    }
  }
}
