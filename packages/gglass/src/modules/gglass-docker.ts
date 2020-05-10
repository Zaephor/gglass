const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// TODO: module to interface with docker service for auto-importing container uris
export const gglassDocker = {
  list: async function () {},
};
