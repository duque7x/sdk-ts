import { REST } from "../src";
const client = new REST({
  clientKey: "877598927149490186",
  authKey: "1QImU1DlWWSLeS2PsnZO3gCLKhrPWj7D",
  guildId: "1336809872884371587",
});

export const colors = {
  Reset: "\x1b[0m",
  FgGreen: "\x1b[32m",
  FgRed: "\x1b[31m",
  FgBlue: "\x1b[34m",
  FgCyan: "\x1b[36m",
};

client.on("debug", console.debug);
/* client.init().then(async (c) => {
  const game = await c.minesGames.create({ bet: 100, bombs: 10, maxMines: 16, status: "created" });
  await game.update({ guild_id: "1336809872884371587", creatorId: "creatorId" });
  console.log({ game });
}); */
export default client;
