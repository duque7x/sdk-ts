import client from ".";
import { Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
  const guild = c.guilds.cache.get("1336809872884371587")!;

  const match = (await guild.matches.create({
    type: "2v2",
    players: [
      {
        id: "Dqueu",
      },
    ],
    channels: [
      {
        id: "duque",
        type: "wefewfwf",
      },
    ],
  })) as GuildMatch;

  /*  await match.messages.create({
    content: "duque",
    type: "duque6",
  });
  await match.messages.create({
    content: "cristi",
    type: "2",
  }); */
  /*  console.log({ messages: match.messages.cache }); */

  match.setStatus("on").then(console.log);
});
