import client from ".";
import { GuildChannelsType } from "../src";

client.init().then(async (c) => {
  const guild = client.guilds.cache.get("1336809872884371587")!;

  //guild.toggleDailyCategory("credit")

  //guild.toggleMode("6v6")

  await guild.addIdToChannel(GuildChannelsType.Commands, "1426949149139533914");
  const channel = guild.channels[GuildChannelsType.Commands];
  console.log({ channel });
});
