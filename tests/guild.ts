import client from ".";
import { Guild, GuildChannelsType, GuildPermissionsTypes } from "../src";
import env from "dotenv";
env.config();

client.init().then(async (c) => {
  const guild =
    client.guilds.cache.get("1336809872884371587") ||
    ((await client.guilds.fetch({ guildId: "1336809872884371587" })) as Guild);
  const bet = await guild.bets.create({
    type: "4v4",
    players: [],
    mode: "mob",
    price: 100,
    status: "created",
  });

  console.log(bet?._id)
});
