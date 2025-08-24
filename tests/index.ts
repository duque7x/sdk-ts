import { REST } from "../v1/rest/REST";
import { APIGuildBet, Optional } from "../v1/types";
const client = new REST("877598927149490186");
const Reset = "\x1b[0m";
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";
const FgBlue = "\x1b[34m";
const FgCyan = "\x1b[36m";

client.on("debug", console.debug);

client.init().then(async () => {
  const guilds = client.guilds;
  const guild = client.guilds.cache.get("1397025735545327789")!;

  const vipmembers = guild.vipMembers.cache;
  console.log(vipmembers);
});
