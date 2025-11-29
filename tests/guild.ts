import client from ".";
import { GuildChannelsType, GuildPermissionsTypes } from "../src";

client.init().then(async (c) => {
  const guild = client.guilds.cache.get("1336809872884371587")!;

  await guild.permissionsManager.addRole(GuildPermissionsTypes.ManageBot, "dque");

  console.log({ perms: guild.permissions.map((c) => ({ ids: c.ids, type: c.type })) });
});
