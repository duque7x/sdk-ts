import client from ".";
import { APIGuildUser, Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
  /*  console.log({
    c1: client.guilds.cache,
    c2: c.guilds.cache,
  }) */
  /* const guild = c.guilds.cache.get("1336809872884371587")!;

  const user = guild.users.cache.get("877598927149490186");

  await user?.addAdvert({ admin_id: "877598927149490186", points_removed: 1000, proof: "d" });
  await user?.addAdvert({ admin_id: "877598927149490186", points_removed: 1000, proof: "d" });
  await user?.addAdvert({ admin_id: "877598927149490186", points_removed: 1000, proof: "d" });
  await user?.addAdvert({ admin_id: "877598927149490186", points_removed: 1000, proof: "d" });
  console.log({ advs: user?.adverts });
  await user?.removeAdvert(); */

  const coi = await client.getStatus();
  console.log({  coi })
});
