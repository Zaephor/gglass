import { google } from "googleapis";
import { api } from "actionhero";

import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";
import { gglassSettings } from "./gglass-settings";

const saltRounds = 5;

// gglass user models
export namespace model {
  export interface user {
    id: string;
    email: string;
    password: string;
    groups?: string[];
  }

  export interface group {
    id: string;
    // label: string;
    icon?: string;
  }
}

const googleUtil = {
  defaultScope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
  async createConnection(basehost) {
    return new google.auth.OAuth2(
      (await gglassSettings.list("user_gauth_id"))[0].value,
      (await gglassSettings.list("user_gauth_secret"))[0].value,
      // TODO: Correct and validate this for http and https
      "http://" + basehost + "/api?action=user:google:callback"
    );
  },
  getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: googleUtil.defaultScope,
    });
  },
};

// gglass user utilities
export const util = {
  // Default attributes to hide
  hideAttributes: ["password"],
  omitKeysObject: function (obj, filter): object {
    filter = !Array.isArray(filter) ? [filter] : filter;
    return typeof obj !== "object"
      ? obj
      : Object.keys(obj).reduce((o, k) => {
          if (filter.indexOf(k) === -1) {
            o[k] = obj[k];
          }
          return o;
        }, {});
  },
  omitKeysCollection: function (collection, filter): Array<object> {
    return collection.reduce((acc, cur) => {
      acc.push(this.omitKeysObject(cur, filter));
      return acc;
    }, []);
  },
  google: {
    authUrl: async (baseHost) => {
      return googleUtil.getConnectionUrl(
        await googleUtil.createConnection(baseHost)
      );
    },
    callback: async (baseHost, code) => {
      const auth = await googleUtil.createConnection(baseHost);
      const data = await auth.getToken(code);
      const tokens = data.tokens;
      auth.setCredentials(tokens);
      const people = google.people({ version: "v1", auth });
      const me = await people.people.get({
        resourceName: "people/me",
        personFields: "emailAddresses,names,photos",
      });
      const userGoogleId = me.data.resourceName;
      const userGoogleEmail =
        me.data.emailAddresses &&
        me.data.emailAddresses.length &&
        me.data.emailAddresses[0].value;
      return {
        id: userGoogleId,
        email: userGoogleEmail,
        tokens: tokens,
      };
    },
  },
};

// gglass user related middleware
export const middleware = {
  "user:inject": {
    name: "user:inject",
    global: true,
    priority: 1100,
    preProcessor: async (data) => {
      data.user = false;
      if (data.session && data.session.data && data.session.data.id) {
        data.user = await api.lowdb["user"]
          .get("users")
          .find({ id: data.session.data.id })
          .value();
      }
    },
  },
  "user:logged_in": {
    name: "user:logged_in",
    global: true,
    priority: 1101,
    preProcessor: async (data) => {
      // Actions by deafult require you to be logged in, if flag "user_logged_in" is set to false, allow guest use
      if (
        data.user === false &&
        !(data.actionTemplate.user_logged_in === false)
      ) {
        throw new Error("Please login.");
      }
    },
  },
  "user:group_check": {
    name: "user:group_check",
    global: true,
    priority: 1102,
    preProcessor: async (data) => {
      // Checking for hardcoded groups on action(mostly ADMIN)
      if (!!data.actionTemplate.user_groups) {
        if (
          !(
            !!data.user.groups &&
            Array.isArray(data.user.groups) &&
            data.user.groups.length > 0 &&
            data.actionTemplate.user_groups.some(
              (x) => data.user.groups.indexOf(x) != -1
            )
          )
        ) {
          throw new Error("Access denied.");
        }
      }
    },
  },
};

// gglass user lib
export const gglassUser = {
  count: async function (): Promise<number> {
    let userCount = api.lowdb["user"].get("users").size().value();
    return userCount || 0;
  },
  list: async function (userId?: string): Promise<Array<object>> {
    await api.lowdb["user"].read(); // Sync DB
    if (!!userId) {
      return [
        await util.omitKeysObject(
          api.lowdb["user"].get("users").find({ id: userId }).value(),
          util.hideAttributes
        ),
      ];
    } else {
      return util.omitKeysCollection(
        api.lowdb["user"].get("users").value(),
        util.hideAttributes
      );
    }
  },
  find: async function (email: string) {
    email = email.toString().toLowerCase();
    await api.lowdb["user"].read(); // Sync DB
    return util.omitKeysObject(
      api.lowdb["user"].get("users").find({ email }).value(),
      util.hideAttributes
    );
  },
  create: async function (
    email: string,
    password: string,
    groups?: Array<string>
  ): Promise<{ created: boolean; user?: object; error?: string }> {
    email = email.toString().toLowerCase();
    await api.lowdb["user"].read(); // Sync DB
    // Find user by email
    let userCheck = api.lowdb["user"].get("users").find({ email }).value();
    if (!!userCheck) {
      // Email exists
      return { created: false, error: "Email exists." };
    } else {
      // New user
      let newUser: model.user = {
        id: uuidv4(),
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        groups: [],
      };

      // Get count of user
      let userCount = api.lowdb["user"].get("users").size().value();
      // Add user to admin group if no users exist
      if (userCount === 0) {
        newUser.groups.push("admin");
      }
      if (!!groups && Array.isArray(groups) && groups.length > 0) {
        groups.forEach((groupId) => {
          newUser.groups.push(groupId);
        });
      }
      await api.lowdb["user"].get("users").push(newUser).write();
      let userCheck = api.lowdb["user"].get("users").find({ email }).value();
      if (!!userCheck.id) {
        return {
          created: true,
          user: await util.omitKeysObject(userCheck, util.hideAttributes),
        };
      } else {
        // TODO: Better creation verification that the creation has failed
        return { created: false };
      }
    }
  },
  login: async function (
    email: string,
    password: string
  ): Promise<object | boolean> {
    email = email.toString().toLowerCase();
    await api.lowdb["user"].read(); // Sync DB
    let userCheck = await api.lowdb["user"]
      .get("users")
      .find({ email })
      .value();
    if (!!userCheck && (await bcrypt.compare(password, userCheck.password))) {
      return util.omitKeysObject(userCheck, util.hideAttributes);
    } else {
      return false;
    }
  },
  google_login: async function (email: string, id: string) {
    email = email.toString().toLowerCase();
    await api.lowdb["user"].read(); // Sync DB
    let userCheck = await api.lowdb["user"]
      .get("users")
      .find({ email })
      .value();
    if (!!userCheck) {
      return util.omitKeysObject(userCheck, util.hideAttributes);
    } else {
      return false;
    }
  },
  // TODO: update function doesn't enforce model.user interface
  update: async function (
    userId: string,
    payload: object
  ): Promise<{ updated: boolean; user?: object }> {
    // TODO: Consider any error cases from this workflow, and that the updates were successful
    await api.lowdb["user"].read(); // Sync DB
    // Find user by id
    let userProfile = api.lowdb["user"]
      .get("users")
      .find({ id: userId })
      .value();
    if (!userProfile) {
      return { updated: false };
    } else {
      let update: any = {};
      Object.keys(payload).forEach((k) => {
        if (
          k === "password" &&
          typeof payload[k] === "string" &&
          (<string>payload[k]).length > 0
        ) {
          bcrypt.hash(payload[k], saltRounds).then((resultHash) => {
            update[k] = resultHash;
          });
        } else if (
          k === "email" &&
          typeof payload[k] === "string" &&
          (<string>payload[k]).length > 0
        ) {
          update[k] = payload[k].toString().toLowerCase();
        } else {
          if (payload[k] !== false) {
            update[k] = payload[k];
          }
        }
      });
      let result = api.lowdb["user"]
        .get("users")
        .find({ id: userId })
        .assign(update)
        .write();
      return {
        updated: true,
        user: await util.omitKeysObject(result, util.hideAttributes),
      };
    }
  },
  delete: async function (userId: string): Promise<{ deleted: boolean }> {
    await api.lowdb["user"].read(); // Sync DB
    let result = await api.lowdb["user"]
      .get("users")
      .remove({ id: userId })
      .write()[0];
    if (!!result.entry) {
      return { deleted: true };
    } else {
      return { deleted: false };
    }
  },
};
