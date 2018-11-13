const fs = require('fs');
const Discord = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, file) => {

    if (err) console.log(err);

    let jsfile = file.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) return console.log("Couldn't find commands.");

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        client.commands.set(props.help.name, props);
    });
});

client.on('ready', () => console.log('The bot is ready to use!'));

client.on('message', message => {
    if (message.author.bot) return undefined;
    if (message.channel.type === "dm") return undefined;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = client.commands.get(cmd.slice(PREFIX.length));
    if (commandfile) commandfile.run(client, message, args);
});

client.login(process.env.BOT_TOKEN);
