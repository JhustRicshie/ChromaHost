
const fs = require('fs');
const Discord = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const client = new Discord.Client({disableEveryone: true});

client.on('ready', () => console.log('The bot is ready to use!'));

client.on('message', async msg => {
    if (msg.author.bot) return undefined;
    if (msg.channel.type === "dm") return undefined;

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    function wrong(messag) {
        msg.channel.send(messag).then(mess => {mess.delete(5000)});
    }
    if (msg.content == `${PREFIX}new`) {
        if (!msg.member.guild.me.hasPermission("MANAGE_CHANNELS")) return wrong("I don't have the Manage Channels permission, so i can't do this!");
        let tcreatoriu = msg.author;
        let tcreatorntlc = msg.author.username;
        let tcreator = msg.author.username.toLowerCase();
        let thalfname = tcreator.split(' ').join('-');
        let tname = `ticket-${thalfname}`;
        const tcategory = msg.guild.channels.find(c => c.name === "tickets");
        if(!tcategory) return wrong("Couldn't find tickets' category!");
        let staffrole = msg.guild.roles.find(`name`, "Staff");
        if (!staffrole) return wrong("Couldn't find Staff role!");
        await msg.guild.createChannel(tname, "text").then(async channel => {
            await channel.setParent(tcategory);
            await channel.overwritePermissions(msg.author, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            await channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL: false, SEND_MESSAGES: false});
            await channel.overwritePermissions(staffrole, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            console.log(tname);
            let tticket = channel;
            if (!tticket) return wrong("Can't find the created ticket channel.");
            let tttid = tticket.id;
            let embed = new Discord.RichEmbed()
            .setTitle(`Created ${tname} ticket!`)
            .setColor("#00edff");
            msg.channel.send(embed);
            let welembed = new Discord.RichEmbed()
            .setDescription("Hello! Here you can choose from 2 options for get help or order something\n\nThese are the 2 options: manually and automatic.Please choose one, by reacting!\n:robot: - for Automatic or :person_with_blond_hair: for Support Team")
            .setColor("#00edff");
            tticket.send(welembed).then(embedmess => {
                embedmess.react("🤖");
                embedmess.react("👱");
                let filter = (fr, user) => fr.emoji.name == "🤖" && user.id == msg.author.id || fr.emoji.name == "👱" && user.id == msg.author.id;
                embedmess.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] })
                    .then(collectedReactions => {
                        let whbr = collectedReactions.first();
                        if (whbr.emoji.name == "🤖") {
                            tticket.send(new Discord.RichEmbed()
                            .setDescription("So you choosed the automatic option! You can choose from these options, with sending a message with the correct number(Example: 7)\n1 - Account Issues \n2 - Technical Issues\n3 - Report Problems\n4 - Urgent Problems\n5 - Donation Queries\n6 - Donations\n7 - Partner\n8 - Extras\n9 - Management\n\nX - Close Ticket")
                            .setColor("#00edff"));
                            const wTypeFilter = m => m.author.id === msg.author.id;
                            tticket.awaitMessages(wTypeFilter, {
                                max: 1,
                                time: 6000000
                            }).then(collWT => {
                                let type;
                                let problem;
                                if (collWT.first().content === "1") {
                                    type = "Account Issues";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "2") {
                                    type = "Technical Issues";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "3") {
                                    type = "Report Problems";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "4") {
                                    type = "Urgent Problems";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "5") {
                                    type = "Donations Queries";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "6") {
                                    type = "Donations";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "7") {
                                    type = "Partner";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "8") {
                                    type = "Extras";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "9") {
                                    type = "Management";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "X") {
                                    tticket.delete();
                                }
                            });
                        } else if (whbr.emoji.name == "👱") {
                            let sprole = msg.guild.roles.find(`name`, "Support Team");
                            tticket.send(`${sprole}`);
                        }
                    });
            });
        });
    } else if (msg.content.startsWith(`${PREFIX}add`)) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        if (!msg.member.guild.me.hasPermission("MANAGE_CHANNELS")) return wrong("I don't have the Manage Channels permission, so i can't do this!");
        let userToAdd = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
        if (!userToAdd) return wrong("You need to specify a member to add to the channel!");
        let channelToAdd = msg.mentions.channels.first() || msg.guild.channels.find(`name`, args[1]);
        if (!channelToAdd) return wrong("You need to specify a ticket to add the member!");
        channelToAdd.overwritePermissions(userToAdd, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
        msg.delete().catch();
        msg.channel.send(new Discord.RichEmbed()
        .setColor("#1dff00")
        .setDescription("✅")).then(message => {message.delete(5000)});
    } else if (msg.content.startsWith(`${PREFIX}close`)) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        if (!msg.member.guild.me.hasPermission("MANAGE_CHANNELS")) return wrong("I don't have the Manage Channels permission, so i can't do this!");
        let channelToRemove = msg.mentions.channels.first() || msg.guild.channels.find(`name`, args[1]);
        if (!channelToRemove) return wrong("You need to specify a ticket to close!");
        channelToRemove.delete();
        msg.delete().catch();
        msg.channel.send(new Discord.RichEmbed()
        .setColor("#1dff00")
        .setDescription("✅")).then(message => {message.delete(5000)});
    } else if (msg.content.startsWith(`${PREFIX}say`)) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        let message = args.join(" ");
        msg.delete().catch();
        msg.channel.send(message);
    } else if (msg.content.startsWith(`${PREFIX}rename`)) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        if (!msg.member.guild.me.hasPermission("MANAGE_CHANNELS")) return wrong("I don't have the Manage Channels permission, so i can't do this!");
        let channelToRename = msg.mentions.channels.first() || msg.guild.channels.find(`name`, args[1]);
        if (!channelToRename) return wrong("You need to specify a ticket to rename!");
        let newName = args[1];
        if (!newName) return wrong("You need to specify a name to rename the ticket!");
        channelToRename.setName(newName);
        msg.delete().catch();
        msg.channel.send(new Discord.RichEmbed()
        .setColor("#1dff00")
        .setDescription("✅")).then(message => {message.delete(5000)});
    } else if (msg.content.startsWith(`${PREFIX}important`)) {
        if (msg.channel.name.includes('ticket')) {
            const importantCategory = msg.guild.channels.find(c => c.name == "important-tickets");
            if (!importantCategory) return wrong("Can't find important-tickets category!");
            msg.channel.setParent(importantCategory);
            msg.channel.send(new Discord.RichEmbed()
            .setColor("#1dff00")
            .setDescription(":white_check_mark: Moved!")).then(message => message.delete(5000));
        } else {
            return msg.channel.send(new Discord.RichEmbed()
            .setColor("#fc1919")
            .setDescription(":x: Can't run this command in this channel! (You must be in a ticket channel)")).then(message => message.delete(5000));
        }
    /*} else if (msg.content.startsWith(`${PREFIX}commission`)) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        let message;
        message = await msg.channel.send(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Starting Manual Commission" +
        "\nPlease mention the role that is required for this project's completion."));
        const filter = m => m.author.id === msg.author.id;
        var requiredRole;
        var details;
        var deadline;
        var tosReaded;
        var extraDetails;
        var priceOrQuote;
        await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 600000
        }).then(collected => {
            requiredRole = collected.first();
            collected.delete();
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Please provide the details of the client's request."));
        await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 600000
        }).then(collected => {
            details = collected.first();
            console.log(details);
        });*/
    } else if (msg.content == `${PREFIX}newhr`) {
        if (!msg.member.guild.me.hasPermission("MANAGE_CHANNELS")) return wrong("I don't have the Manage Channels permission, so i can't do this!");
        let tcreatoriu = msg.author;
        let tcreatorntlc = msg.author.username;
        let tcreator = msg.author.username.toLowerCase();
        let thalfname = tcreator.split(' ').join('-');
        let tname = `ticket-${thalfname}`;
        const tcategory = msg.guild.channels.find(c => c.name === "management-tickets");
        if(!tcategory) return wrong("Couldn't find tickets' category!");
        let staffrole = msg.guild.roles.find(`name`, "Management");
        if (!staffrole) return wrong("Couldn't find Staff role!");
        await msg.guild.createChannel(tname, "text").then(async channel => {
            await channel.setParent(tcategory);
            await channel.overwritePermissions(msg.author, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            await channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL: false, SEND_MESSAGES: false});
            await channel.overwritePermissions(staffrole, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            console.log(tname);
            let tticket = channel;
            if (!tticket) return wrong("Can't find the created ticket channel.");
            let tttid = tticket.id;
            let embed = new Discord.RichEmbed()
            .setTitle(`Created ${tname} ticket!`)
            .setColor("#00edff");
            msg.channel.send(embed);
            let welembed = new Discord.RichEmbed()
            .setDescription("Hello! Here you can choose from 2 options for get help or order something\n\nThese are the 2 options: manually and automatic.Please choose one, by reacting!\n:robot: - for Automatic or :person_with_blond_hair: for Support Team")
            .setColor("#00edff");
            tticket.send(welembed).then(embedmess => {
                embedmess.react("🤖");
                embedmess.react("👱");
                let filter = (fr, user) => fr.emoji.name == "🤖" && user.id == msg.author.id || fr.emoji.name == "👱" && user.id == msg.author.id;
                embedmess.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] })
                    .then(collectedReactions => {
                        let whbr = collectedReactions.first();
                        if (whbr.emoji.name == "🤖") {
                            tticket.send(new Discord.RichEmbed()
                            .setDescription("So you choosed the automatic option! You can choose from these options, with sending a message with the correct number(Example: 7)\n1 - Account Issues \n2 - Technical Issues\n3 - Report Problems\n4 - Urgent Problems\n5 - Donation Queries\n6 - Donations\n7 - Partner\n8 - Extras\n9 - Management\n\nX - Close Ticket")
                            .setColor("#00edff"));
                            const wTypeFilter = m => m.author.id === msg.author.id;
                            tticket.awaitMessages(wTypeFilter, {
                                max: 1,
                                time: 6000000
                            }).then(collWT => {
                                let type;
                                let problem;
                                if (collWT.first().content === "1") {
                                    type = "Account Issues";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "2") {
                                    type = "Technical Issues";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "3") {
                                    type = "Report Problems";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "4") {
                                    type = "Urgent Problems";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "5") {
                                    type = "Donations Queries";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "6") {
                                    type = "Donations";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "7") {
                                    type = "Partner";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "8") {
                                    type = "Extras";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "9") {
                                    type = "Management";
                                    tticket.send(new Discord.RichEmbed()
                                    .setDescription("Please give us all the details about your problem!")
                                    .setColor("#00edff"));
                                    const msgreactfilter = m => m.author.id === msg.author.id;
                                    tticket.awaitMessages(msgreactfilter, {
                                        max: 1,
                                        time: 600000
                                    }).then(collPGU => {
                                        problem = collPGU.first();
                                        tticket.send(new Discord.RichEmbed()
                                        .setTitle("We do like to help you! Our staff will help you soon, stay tuned!")
                                        .setColor("#00edff"));
                                        let helpschannel = msg.guild.channels.find(`name`, "help-requests");
                                        helpschannel.send(new Discord.RichEmbed()
                                        .setTitle("Help needed!")
                                        .setAuthor(tcreatorntlc, tcreatoriu.avatarURL)
                                        .addField("Type", type)
                                        .addField("Problem", problem)
                                        .addField("Channel", tticket)
                                        .setColor("#00edff")).then(thismessagelol => {
                                            thismessagelol.react("✅");
                                            thismessagelol.react("❌");
                                            const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot || reaction.emoji.name === '❌' && !user.bot;
                                            const collector = thismessagelol.createReactionCollector(filter, { time: 600000 });
                                             collector.on('collect', async reaction => {
                                                const user = reaction.users.last();
                                                const guild = reaction.message.guild;
                                                const member = guild.member(user) || await guild.fetchMember(user);
                                                channel.overwritePermissions(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                                tticket.send(new Discord.RichEmbed()
                                                .setColor("#00edff")
                                                .setTitle(`Staff found! ${member.displayName} is going to help you!`));
                                            });
                                        });
                                    });
                                } else if (collWT.first().content === "X") {
                                    tticket.delete();
                                }
                            });
                        } else if (whbr.emoji.name == "👱") {
                            let sprole = msg.guild.roles.find(`name`, "Support Team");
                            tticket.send(`${sprole}`);
                        }
                    });
            });
        });
    }
});

client.login(TOKEN);
