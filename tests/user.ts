import client from ".";
import { APIGuildUser, Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
  /*  console.log({
    c1: client.guilds.cache,
    c2: c.guilds.cache,
  }) */
  const guild = c.guilds.cache.get("1336809872884371587")!;

  const users = guild.users.cache.toArray().slice(0, 10);

  const coi = users.map((u) => {
    u.games = 100;
    u.points = 100000;
    return u.toJSON() as APIGuildUser;
  });
  await guild.users.updateMany(...coi);
});
