import { request } from "undici";

/* import client from ".";
import { APIGuildUser, Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
  const guild = c.guilds.cache.get("1336809872884371587")!;

  const user = guild.users.cache.get("1252042503486574605");

  user?.update({ type: "add", points: guild.scores.mvp + 500, mvps: 1 });
  console.log({ p: user?.points });
});
 */
async function c() {
  const p = await request('https://cdn.discordapp.com/attachments/1445202188258377843/1445205454689927330/1e3c9e2d8b518d2f91e833ba87821c5b.jpg?ex=692f7ff7&is=692e2e77&hm=08ff3a98d4ae754d8f331075c09bf7d73769fcff43ed24870846c4081f5a0ae2&', { method: "GET" });

  console.log({ o: await p.statusCode })
}

c();