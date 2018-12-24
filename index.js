
const fs = require('fs');
const Discord = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const client = new Discord.Client({disableEveryone: true});
const arraySort = require('array-sort');

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
            let tticket = channel;
            if (!tticket) return wrong("Can't find the created ticket channel.");
            let tttid = tticket.id;
            let embed = new Discord.RichEmbed()
            .setTitle(`Created ${tname} ticket!`)
            .setColor("#00edff");
            msg.channel.send(embed);
            tticket.send(new Discord.RichEmbed()
            .setTitle("Arctic Tickets System")
            .setDescription(`Welcome ${tcreatoriu.username}#${tcreatoriu.tag} to Arctic Studios. ` +
                            `\n` + 
                            `Please select one of the reactions below to decide how you want to proceed.` +
                            `\n` +
                            `:regional_indicator_a: => Get a random Sales rep.` +
                            `:regional_indicator_b: => Assign a specific Sales rep.`)
            .setColor("#00edff")).then(message => {
                message.react("🇦");
                message.react("🇧");

                const filter = (fr, user) => fr.emoji.name == "🇦" && user.id == tcreatoriu.id || fr.emoji.name == "🇧" && user.id == tcreatoriu.id;
                message.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
                    .then(collected => {
                        let reacted = collected.first();
                        let salesRepRole = msg.guild.roles.find(r => r.name == "Sales Rep");
                        if (reacted.emoji.name == "🇦") {
                            if (!salesRepRole) return wrong("Can't find Sales Rep role!");
                            let randomRep = salesRepRole.members.random();
                            tticket.overwritePermissions(randomRep, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                            tticket.send(new Discord.RichEmbed()
                            .setTitle(`Selected a random Sales Rep! ${randomRep.user.username} has been moved to this ticket!`)
                            .setColor("#0ecef4"));
                        } else if (reacted.emoji.name == "🇧") {
                            let embed = new Discord.RichEmbed()
                            .setTitle("Please type the name of the Sales Rep!")
                            .setColor("#0ecef4");
                            tticket.send(embed).then(() => {
                                let filter = m => m.author.id === msg.author.id;
                                tticket.awaitMessages(filter, { max: 1, time: 6000000, errors: [ 'time' ]})
                                    .then(async collectedd => {
                                        var salesRep = collectedd.first();
                                        let searcmsg;
                                        searcmsg = await tticket.send(new Discord.RichEmbed()
                                        .setTitle(`Searching Sales Rep named: ${salesRep} 🔍`)
                                        .setColor("#0ecef4"));
                                        tticket.send(searcmsg);
                                        let srRole = msg.guild.roles.find(r => r.name == "Sales Rep");
                                        console.log(salesRep);
                                        let realSalesRep = msg.guild.members.find(m => m.user.username == salesRep);
                                        if (!realSalesRep) return searcmsg.edit(new Discord.RichEmbed()
                                        .setTitle(":x: ERROR: Can't find Sales Rep!")
                                        .setColor("#ff0000"));
                                        searcmsg.edit(new Discord.RichEmbed()
                                        .setTitle(`:white_check_mark: Sales Rep (named: ${salesRep}) has been founded and added to this ticket!`)
                                        .setColor("#29f247"));
                                        tticket.overwritePermissions(realSalesRep, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                                    });
                            });
                        }
                    });
            });
        });
    } else if (msg.content == `${PREFIX}add`) {
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
    } else if (msg.content == `${PREFIX}close`) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        if (!msg.member.guild.me.hasPermission("MANAGE_CHANNELS")) return wrong("I don't have the Manage Channels permission, so i can't do this!");
        let embed = new Discord.RichEmbed()
        .setColor("#f73131")
        .setDescription("Are you sure you want to close this ticket? This channel will be deleted." + 
        "\n**Repeat the command to close this ticket!**" + 
        "\nYou have 20 seconds to do this, or the closing will be aborted!");
        msg.channel.send(embed);
        const filter = m => m.author.id === msg.author.id;
        msg.channel.awaitMessages(filter, {
            max: 1,
            time: 20000
        }).then(collected => {
            if (collected.first() == `${PREFIX}close`) {
                msg.channel.delete();
            }
        });
    } else if (msg.content == `${PREFIX}say`) {
        if (!(msg.member.hasPermission("MANAGE_CHANNELS"))) return wrong("You haven't got permission to do this!");
        let message = args.join(" ");
        msg.delete().catch();
        msg.channel.send(message);
    } else if (msg.content == `${PREFIX}rename`) {
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
    } else if (msg.content == `${PREFIX}important`) {
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
    } else if (msg.content == `${PREFIX}commission`) {
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
            msg.channel.bulkDelete(1);
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Please provide the details of the client's request."));
        await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 6000000
        }).then(collected => {
            details = collected.first();
            msg.channel.bulkDelete(1);
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("What is the deadline?"));
        await msg.channel.awaitMessages(filter, {
            max:1, 
            time: 600000
        }).then(collected => {
            deadline = collected.first();
            msg.channel.bulkDelete(1);
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Have they read the TOS?"));
        await msg.channel.awaitMessages(filter, {
            max:1, 
            time: 60000
        }).then(collected => {
            tosReaded = collected.first();
            msg.channel.bulkDelete(1);
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Any extra details?"));
        await msg.channel.awaitMessages(filter, {
            max:1, 
            time: 600000
        }).then(collected => {
            extraDetails = collected.first();
            msg.channel.bulkDelete(1);
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Has the price been set or is a quote needed? (If a price has been decided on please reply with the amount.)"));
        await msg.channel.awaitMessages(filter, {
            max:1, 
            time: 600000
        }).then(collected => {
            priceOrQuote = collected.first();
            msg.channel.bulkDelete(1);
        });
        message.edit(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setTitle("Commission has been posted!"));
        let commissionChannel = msg.guild.channels.find(c => c.name == "commissions");
        if (!commissionChannel) return wrong("Can't find commissions channel!");
        console.log(requiredRole);
        commissionChannel.send(`${requiredRole}`);
        commissionChannel.send(new Discord.RichEmbed()
        .setColor("#42f4f1")
        .setAuthor(`${msg.author.username} | ${msg.channel.name}`, msg.author.avatarURL)
        .setTitle("Incoming Commission!")
        .addField("Please give us all the details about your request.", details)
        .addField("When do you want this to be finished? Please put down a date.", deadline)
        .addField("Have you read our #terms-of-service and accept them? Yes/No", tosReaded)
        .addField("If you missed to give us some details, please put them below to make sure you get what you want!", extraDetails)
        .addField("What is your budget or do you need a quote?", priceOrQuote)
        .setTimestamp(new Date())).then(async message => {
            message.react("✅");
            message.react("❌");
            let reactionsFilter = (fr, user) => fr.emoji.name == "✅" && user.id == msg.author.id || fr.emoji.name == "❌" && user.id == msg.author.id;
            await message.awaitReactions(reactionsFilter, { max: 1, time: 2147483647, errors: ['time'] })
                .then(collected => {
                    let reacted = collected.first();
                    if (reacted.emoji.name == "✅") {
                        console.log("yes");
                    } else if (reacted.emoji.name == "❌") {
                        console.log("no");
                    }
                });
        });
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
        let bodRole = msg.guild.roles.find(r => r.name == "Board of Directors");
        if (!bodRole) return wrong("Can't find Board of Directors role!");
        await msg.guild.createChannel(tname, "text").then(async channel => {
            await channel.setParent(tcategory);
            await channel.overwritePermissions(msg.author, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            await channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL: false, SEND_MESSAGES: false});
            await channel.overwritePermissions(staffrole, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            await channel.overwritePermissions(bodRole, {VIEW_CHANNEL: true, SEND_MESSAGES: true});
            let tticket = channel;
            if (!tticket) return wrong("Can't find the created ticket channel.");
            let tttid = tticket.id;
            let embed = new Discord.RichEmbed()
            .setTitle(`Created ${tname} ticket!`)
            .setColor("#00edff");
            msg.channel.send(embed);
           tticket.send(new Discord.RichEmbed()
            .setTitle("Arctic Tickets System")
            .setDescription(`Welcome ${tcreatoriu.username}#${tcreatoriu.tag} to Arctic Studios. ` +
                            `\n` + 
                            `Please select one of the reactions below to decide how you want to proceed.` +
                            `\n` +
                            `:regional_indicator_a: => Speak to a Board of Directors Member.` +
                            `:regional_indicator_b: => Speak to an HR Representative.`)
            .setColor("#00edff")).then(message => {
                message.react("🇦");
                message.react("🇧");

                const filter = (fr, user) => fr.emoji.name == "🇦" && user.id == tcreatoriu.id || fr.emoji.name == "🇧" && user.id == tcreatoriu.id;
                message.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
                    .then(collected => {
                        let reacted = collected.first();
                        if (reacted.emoji.name == "🇦") {
                            let bodRole = msg.guild.roles.find(r => r.name == "Board of Directors");
                            if (!bodRole) return wrong("Can't find Board of Directors role!");
                            tticket.send(`${bodRole}`).then(message => message.delete(5000));
                        } else if (reacted.emoji.name == "🇧") {
                            let mRole = msg.guild.roles.find(r => r.name == "Management");
                            if (!mRole) return wrong("Can't find Management role!");
                            tticket.send(`${mRole}`).then(message => message.delete(5000));
                        }
                    });

                });
        });
    } else if (msg.content.startsWith(`${PREFIX}pay`)) {
        let amount = args[0];
        if (!amount) return wrong("Please specify an amount to pay!");
        return msg.channel.send(new Discord.RichEmbed()
        .setTitle("PayPal")
        .setDescription(`You have to pay $${amount}
        [Click here to pay](https://www.paypal.me/seniorteam1/${amount})`)
        .setColor("#00edff")
        .setTimestamp(new Date()));
    }
});

client.on("guildMemberAdd", async member => {
    let joinlog = member.guild.channels.find(c => c.name === "join-log");
    if (!joinlog) return console.log("Join-log channel not found!");
    let invites = await member.guild.fetchInvites();
    var inviteAmmount;
    var invitedBy;
    invites = invites.array();
    invites.forEach(function(invite) {
        inviteAmmount = invite.uses;
        invitedBy = invite.inviter;
    });
    joinlog.send(new Discord.RichEmbed()
    .setColor("#165fe5")
    .setTitle(`Welcome ${member.user.tag}`)
    .setDescription(`Welcome to the theater of memes \n
                    Invited By: ${invitedBy.username} => ${inviteAmmount} Invites`)
    .setThumbnail(member.user.displayAvatarURL));
});

client.login(TOKEN);
