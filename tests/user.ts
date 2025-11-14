import client from ".";
import { Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
 /*  console.log({
    c1: client.guilds.cache,
    c2: c.guilds.cache,
  }) */
  const guild = c.guilds.cache.at(0)!;
  const users = guild?.users.cache;
  const user = guild.users.cache.get("877598927149490186");
  await user?.update({

    profile: {
      bio: "Duqueeeeeeuwuerquweqwe"
    }
   });

});
