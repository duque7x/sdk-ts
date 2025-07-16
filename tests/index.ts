import { REST } from "../src/rest/REST";

const client = new REST('877598927149490186');
client.setKey('877598927149490186');
client.on('debug', console.log);


client.init().then(c => {
    console.log(c.guilds.cache)
});