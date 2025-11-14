import { REST } from "../src";
const client = new REST("877598927149490186");

export const colors = {
  Reset: "\x1b[0m",
  FgGreen: "\x1b[32m",
  FgRed: "\x1b[31m",
  FgBlue: "\x1b[34m",
  FgCyan: "\x1b[36m",
};

client.on("debug", console.debug);

export default client;
