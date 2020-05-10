import { Action, api } from "actionhero";
import { gglassMenu } from "../modules/gglass-menu";
import { gglassSettings } from "../modules/gglass-settings";

const util = require("util");

const commandPrefix = "user:traefik:";

let uriUtil = {
  findExact(o, url, groups) {
    if (!o.url) {
      return false;
    }
    if (o.url === url) {
      if (groups.length < o.groups) {
        return o.groups.some((x) => groups.indexOf(x) != -1);
      } else {
        return groups.some((x) => o.groups.indexOf(x) != -1);
      }
    }
  },
  findEntry(o, url, groups) {
    if (!o.url) {
      return false;
    }
    // if (o.url.startsWith(url) || url.startsWith(o.url)) {
    if (url.startsWith(o.url)) {
      if (groups.length < o.groups) {
        return o.groups.some((x) => groups.indexOf(x) != -1);
      } else {
        return groups.some((x) => o.groups.indexOf(x) != -1);
      }
    }
  },
};

// Traefik Validation endpoint
export class TraefikAuthCheck extends Action {
  user_logged_in = false;

  constructor() {
    super();
    this.name = commandPrefix + "auth_check";
    this.description = "Endpoint for traefik to do forward auth";
    // this.logLevel = "debug";
    this.inputs = {};
    this.outputExample = {};
  }

  async run(data) {
    // Three flows, solo, trusted relay, permission relay
    // Solo, Compare user groups and uri-prefix groups
    // * Simple, straightforward, single host

    // Trusted relay, Compare user groups and uri-prefix groups, add shared X-GglassPeerKey header (Make this header configurable later?)
    // * Two gglass hosts with traefik, direct peers but only one public
    // * Public gglass performs group comparison, attaches key header if successful
    // * Private gglass detects key header, bypass group checks
    // * Only applies to traefik auth_check, ignored for gglass apis

    // Permission relay,
    // * Two gglass hosts with traefik, direct peers but only one public
    // * Public gglass adds user groups and key to headers
    // * Private gglass validates key, compares groups
    // * Only applies to traefik auth_check, ignored for gglass apis

    let [gglassPeerKey] = await gglassSettings.list("gglass_peer_key");
    console.log(util.inspect(data, false, null, true /* enable colors */));
    if (data.user === false) {
      throw new Error("Please login.");
    }
    let destinationUri =
      data.connection.rawConnection.req.headers["x-forwarded-uri"];
    let userGroups = data.user.groups;
    await api.lowdb["menu"].read(); // Sync DB
    let menuExact = api.lowdb["menu"]
      .get("entries")
      .orderBy(["url"], ["desc"])
      .find((o) => uriUtil.findExact(o, destinationUri, userGroups))
      .value();
    let menuApprox = api.lowdb["menu"]
      .get("entries")
      .orderBy(["url"], ["desc"])
      .find((o) => uriUtil.findEntry(o, destinationUri, userGroups))
      .value();
    console.log(
      util.inspect(
        { destinationUri, userGroups, menuExact, menuApprox, gglassPeerKey },
        false,
        null,
        true /* enable colors */
      )
    );

    // let siteGroups =
  }
}
