const fs = require('fs');
const Discord = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const client = new Discord.Client({disableEveryone: true});

client.on('ready', () => console.log('The bot is ready to use!'));

client.on('message', msg => {
    if (msg.author.bot) return undefined;
    if (msg.channel.type === "dm") return undefined;

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    function wrong(msg) {
        msg.channel.send(msg).then(mess => {mess.delete(5000)});
    }
    if (msg.content.startsWith(`${PREFIX}new`)) {
        let tcreator = msg.author.username;
        let tname = `ticket-${tcreator}`;
        const tcategory = msg.guild.channels.find(c => c.name === "tickets");
        if(!tcategory) return wrong("Couldn't find tickets' category!");
        let staffrole = msg.guild.roles.find(`name`, "Staff");
        if (!staffrole) return wrong("Couldn't find Staff role!");
        let tticket;
        await msg.guild.createChannel(tname, "text").then(channel => {
            channel.setParent(tcategory);
            channel.overwritePermissions(msg.author, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL: false, SEND_MESSAGES: false});
            channel.overwritePermissions(staffrole, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            tticket = msg.guild.channels.find(`name`, `ticket-${msg.author.username}`);
        });
        if (!tticket) return wrong("Can't find the created ticket channel.");
        let embed = new Discord.RichEmbed()
        .setTitle(`Created ${tticket} ticket!`)
        .setColor("#00edff");
        msg.channel.send(embed);
        let welembed = new Discord.RichEmbed()
        .setDescription("Hello! Here you can choose from 2 options for get help or order something\n\nThese are the 2 options: manually and automatic.Please choose one, by reacting!\n:robot: - for Automatic or :person_with_blond_hair: for Support Team")
        .setColor("#00edff");
        tticket.send(welembed).then(mess => {
            mess.react("🤖");
            mess.react("👱");
            const filter = (reaction, user) => {
                return ['🤖', '👱'].includes(reaction.emoji.name);
            };
            mess.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '🤖') {
                        
                    } else if (reaction.emoji.name === '👱') {
                        tticket.send("@Support Team");
                    }
                })
                .catch(collected => {
                    console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
                });
        });
    }
});

client.login(TOKEN);
