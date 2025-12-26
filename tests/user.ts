
import client from ".";

client.init().then(async (c) => {
  const guild = c.guilds.cache.get("1336809872884371587")!;
  const user = guild.betusers.cache.get("877598927149490186");
  const _user = guild.betusers.cache.get("877598927149490186");

  await user?.update({ type: "add", wins: 1});
  console.log({ user: user?.toJSON(), _user: _user?.toJSON() });
});
