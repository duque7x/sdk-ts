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

  /*  const vipmembers = guild.vipMembers.cache;
  console.log(vipmembers);

  await Promise.all([
    guild.setScore("win", 245),
    guild.setScore("creator", 125),
    guild.setScore("mvp", 90),
    guild.setScore("loss", 150),
  ]);
  console.log(guild.scores); */

  /*   const giveaway = await client.giveaways.create({
    host_id: "877598927149490186",
    channel_id: "877598927149490186",
    guild_id: "877598927149490186",
    prizes: ["Duquw"],
    message: {
      content: ["Duque ta ligado"].join("\n"),
      type: "text",
      id: "877598927149490186",
    },
  }); */
  const giveaway = client.giveaways.cache.get("68ade5a9244f970fd287a201");
  console.log({ giveaway });
});
