//TODO: Split ah-session-plugin off as it's own npm module
import { config, api } from "actionhero";
import * as crypto from "crypto";

const prefix: string = config.general.serverName + ":session:";
const duration: number = 60 * 60; //1 hour

export namespace session {
  interface ConnectionObj {
    fingerprint: string;
    type: string;
    remoteIP: string;
    rawConnection: any;
  }

  export async function load(
    connection: ConnectionObj
  ): Promise<object | false> {
    // Primarily used by the middleware to load the session to data.session
    const key: string = prefix + connection.fingerprint;
    const data: string = await api.redis.clients.client.get(key);
    return data ? JSON.parse(data) : false;
  }

  export async function create(
    connection: ConnectionObj,
    data: any
  ): Promise<boolean> {
    // Should be called by the user-auth system. Data should be serializable. Ideally userID or some other identifier
    const key: string = prefix + connection.fingerprint;
    const csrfToken = crypto.randomBytes(64).toString("hex");

    const sessionData = {
      data: data,
      csrfToken: csrfToken,
      sesionCreatedAt: new Date().getTime(),
      clientIp: connection.remoteIP,
      userAgent:
        connection.type === "web"
          ? connection.rawConnection.req.headers["user-agent"]
          : null,
    };

    return (
      (await api.redis.clients.client.set(
        key,
        JSON.stringify(sessionData),
        "EX",
        duration
      )) == "OK"
    );
  }

  export async function destroy(connection: ConnectionObj): Promise<boolean> {
    // Should be called by the user-auth system to clear a session/logout
    const key: string = prefix + connection.fingerprint;
    return (await api.redis.clients.client.del(key)) > 0;
  }
}

export const middleware = {
  "session:inject": {
    name: "session:inject",
    global: true,
    priority: 1000,
    preProcessor: async (data) => {
      data.session = await session.load(data.connection);
      const key: string = prefix + data.connection.fingerprint;
      await api.redis.clients.client.expire(key, duration);
    },
  },
};
