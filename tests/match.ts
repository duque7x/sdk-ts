import client from ".";
import { Guild, GuildMatch, MatchSelection } from "../src";

client.init().then(async (c) => {
  const guild = c.guilds.cache.get("1336809872884371587")!;
  const bet = (await guild.bets.create({
    type: "4v4",
    players: [
      {
        id: "Dqueu",
      },
    ],
  }))!;
  await bet.messages.create({ content: "fuck d" })
  await bet.addPlayer({ id: "877598927149490186" }, "duque");
  await bet.update({ price: 20,  });

  console.log({ messages: bet.toJSON() });
});
