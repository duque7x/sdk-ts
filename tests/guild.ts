import client from ".";
import { GuildChannelsType, GuildPermissionsTypes } from "../src";

client.init().then(async (c) => {
  const guild = client.guilds.cache.get("1336809872884371587")!;
 
  guild.removeIdInChannel(GuildChannelsType.Blacklist, ['1412414533154242642'])
});
