import client from ".";
import { Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
  const guild = c.guilds.cache.get("1336809872884371587")!;
  const match = (await guild.matches.create({
    type: "4v4",
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

  await match.messages.create({
    content: Buffer.from("dwdwdwdwdwd", "binary"),
    author_id: "877598927149490186",
    extension: "txt",
  });
  console.log({ messages: match.messages.cache });
});
