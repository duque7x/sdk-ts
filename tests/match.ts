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

  match.setStatus("on");
});
