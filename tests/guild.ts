import client from ".";
import { GuildChannelsType, GuildPermissionsTypes } from "../src";

client.init().then(async (c) => {
  const guild = client.guilds.cache.get("1336809872884371587")!;

  await guild.setChannelIds(GuildChannelsType.UserLogs, "1444783760686973058");
  await guild.setChannelIds(GuildChannelsType.QueueLogs, "1431659615707332669");
  await guild.setChannelIds(GuildChannelsType.ManagingLogs, "1439719195045527694");

  console.log({ chs: guild.channels });
});
