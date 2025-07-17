import { REST } from "../src/rest/REST";
const client = new REST("877598927149490186");
const Reset = "\x1b[0m";
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";
const FgBlue = "\x1b[34m";
const FgCyan = "\x1b[36m";

client.on("debug", console.log);

client.init().then(async () => {
  const guild = client.guilds.cache.get("1336809872884371587")!;
  const users = guild.betUsers.cache;

  const me = users.get("877598927149490186")!;

  const bets = client.bets;
  console.log(`${FgRed}There are ${bets.size} bets.${Reset}`);
  console.log(
    `${FgGreen}Last bet_id: ${
      bets
        .toArray()
        .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())[0]._id
    } ${Reset}`
  );
});
