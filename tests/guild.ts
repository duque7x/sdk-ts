import client from ".";
import { Guild, GuildChannelsType, GuildPermissionsTypes } from "../src";
import env from "dotenv";
env.config();

client.init().then(async (c) => {
  const guild =
    client.guilds.cache.get("1336809872884371587") ||
    ((await client.guilds.fetch({ guildId: "1336809872884371587" })) as Guild);

  await guild.addIdToChannel(GuildChannelsType.QueueLogs, "1431659615707332669");

  await guild.setStatus("logs_queues", "on");
});
