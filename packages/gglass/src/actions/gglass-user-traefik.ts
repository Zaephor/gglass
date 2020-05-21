import { Action, api } from "actionhero";
import { gglassMenu, util as menuUtil } from "../modules/gglass-menu";
import { gglassSettings } from "../modules/gglass-settings";

const util = require("util");

// Auth flows for traefik's forwardauth behavior
// Solo - Meant for single host running traefik, gglass, and anything else.
// ** If a trusted PSK is configured, is added to the response header for traefik to copy with "authResponseHeaders"
// Trusted relay - Check for PSK header, if present+matches, access is granted. PSK should be added from the solo flow.
// ** In this case, "public" gglass performs solo-flow and adds the trusted PSK. The "private" gglass sees the trusted PSK and permits access
// ** This flow assumes the "private" gglass can inherently trust the public one. Possible security issues here
// TODO: Re-Eval psk handling, possibly TOTP of peerkey or Signed-JWT
// TODO: Still not a fan of this section, high probability that I'll rewrite this a few more times later, but I think it's functional

const commandPrefix = "user:traefik:";

let uriUtil = {
  matchUrlPrefix(entryUri, reqUri) {
    // console.log({
    //   entryUri,
    //   reqUri,
    //   exact: entryUri === reqUri,
    //   startsWith: reqUri.startsWith(entryUri)
    // })
    if (entryUri === false) {
      return false;
    }
    return entryUri === reqUri || reqUri.startsWith(entryUri);
  },
  find(type, o, url, groups) {
    // Filter out entries missing a url
    if (!o.url) {
      return false;
    }
    if (
      (type === "exact" && o.url === url) ||
      (type === "prefix" && url.startsWith(o.url))
    ) {
      // Entry has no groups, wide-open
      if (o.groups && o.groups.length === 0) {
        return true;
      }
      // Check for overlapping groups
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
    // console.log(util.inspect(data, false, null, true /* enable colors */));
    let reqPresharedKey =
      data.connection.rawConnection.req.headers["x-gglass-psk"];
    let reqUri = data.connection.rawConnection.req.headers["x-forwarded-uri"];
    if (!reqUri) {
      throw new Error(
        "Error: X-Forwarded-URI was not defined, this endpoint is not meant for direct access."
      );
    }

    // Check if either user is logged in, or if trusted relay key was provided
    if (data.user === false && typeof reqPresharedKey === "undefined") {
      throw new Error("Please login.");
    }

    // Regular auth flow
    if (data.user && data.user.groups) {
      // Get all entries that cover request url
      let menuMatch = await gglassMenu.findAll((o) =>
        uriUtil.matchUrlPrefix(o.url || false, reqUri)
      );

      for (let idx = menuMatch.length - 1; idx >= 0; idx--) {
        // If entry has a parent, check for parents' permissions
        if (!!menuMatch[idx].parent) {
          let parent = await gglassMenu.findOne({ id: menuMatch[idx].parent });
          // If parent has a parent, this entry is already invalid, remove. Also remove entry if parent's permissions don't match
          if (
            !!parent.parent ||
            !menuUtil.groupFilter(parent.groups, data.user.groups)
          ) {
            menuMatch.splice(idx, 1);
          } else {
            // I can probably disregard this, leaving it in for debugging to understand what permissions a record was associated with
            menuMatch[idx].groups = parent.groups;
          }
        } else if (
          !menuUtil.groupFilter(menuMatch[idx].groups, data.user.groups)
        ) {
          // If root-element, evaluate groups and remove if not a match
          menuMatch.splice(idx, 1);
        }
      }

      console.log(
        util.inspect(
          { menuMatch, matchlength: menuMatch.length },
          false,
          null,
          true /* enable colors */
        )
      );
      if (menuMatch.length === 0) {
        throw new Error("Access denied.");
      } else {
        let [gglassPresharedKey] = await gglassSettings.list("gglass_psk");
        // If we have a trusted PSK configured, set the header
        if (!!gglassPresharedKey.value) {
          data.connection.setHeader("x-gglass-psk", gglassPresharedKey.value);
        }
      }
    }

    // Validate trusted relay PSK
    if (typeof reqPresharedKey === "string") {
      let [gglassPresharedKey] = await gglassSettings.list("gglass_psk");
      if (reqPresharedKey !== gglassPresharedKey.value) {
        throw new Error("Access denied.");
      }
    }
  }
}
