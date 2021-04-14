const Discord = require('discord.js');
const express = require('express');
const db = require('ognom.db');

const app = express();
const client = new Discord.Client({ partials: Object.values(Discord.Constants.PartialTypes) })
const prefix = "v.";
const code = (str) => "`" + str + "`";

(async () => {
  var data = await db.get('*');
  if (!data.guilds) await db.set('guilds', {});
})();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(8080, () => {
  console.log(`Listening on *:8080`);
});

client.on('message', async (message) => {
  if (!message.guild) return;
  var guilds = await db.get('guilds');
  if (!guilds[message.guild.id]) await db.set('guilds.' + message.guild.id, {
    channel: null,
    timeout: null,
    button: true
  });
  var guild = await db.get('guilds.' + message.guild.id);
  if (message.channel.id == guild.channel) {
    var deleted = false;
    if ((guild.button === true || guild.button == null) && message.author.bot == false) message.react('<a:vent:831939773781377026>');
    setTimeout(() => {
      if (!message.deleted) {
        message.delete();
      }
    }, guild.timeout || 60000);
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  (async () => {
    if (user.id == client.user.id) return;
    if (reaction.emoji.name == "vent" && user.id == (await reaction.message.fetch()).author.id && reaction.message.channel.id == (await db.get('guilds.' + reaction.message.guild.id + '.channel'))) {
      reaction.message.delete();
    } else if (reaction.emoji.name == "vent" && user.id !== client.user.id) {
      reaction.users.remove(user.id);
    }
  })().catch(console.log);
});

client.on('ready', () => {
  console.log('Logged in to ' + client.user.tag);
  client.user.setPresence({
    status: "online",
    activity: {
      name: "/help on " + client.guilds.cache.size + " servers",
      type: "PLAYING"
    }
  });
  if (false) {
    // to update global commands
    client.api.applications(client.user.id).commands.post({data: {
      name: 'help',
      description: 'Bring up the help menu'
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'link',
      description: 'Link the venting channel',
      options: [
        {
            "name": "channel",
            "description": "The channel you want to link",
            "type": 7,
            "required": false
        },
      ]
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'delay',
      description: 'Set the delay in seconds',
      options: [
        {
            "name": "delay",
            "description": "The delay in seconds",
            "type": 4,
            "required": false
        },
      ]
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'button',
      description: 'Toggle delete button'
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'status',
      description: 'See VentBot status and uptime'
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'vote',
      description: 'Vote for VentBot for additional features'
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'invite',
      description: 'Invite VentBot to your server'
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'website',
      description: 'Visit the VentBot Website'
    }});
    client.api.applications(client.user.id).commands.post({data: {
      name: 'support',
      description: 'Join the VentBot support server'
    }});
  }
  if (false) {
    // for removing test commands
    client.api.applications(client.user.id).guilds('825183121656905780').commands.get().then(commands => commands.forEach(command => client.api.applications(client.user.id).guilds('825183121656905780').commands(command.id).delete()));
  }
  if (false) {
    // for testing
    client.api.applications(client.user.id).guilds('825183121656905780').commands.post({data: {
      name: 'support',
      description: 'Join the VentBot support server'
    }});
  }
});

client.ws.on('INTERACTION_CREATE', async interaction => {
  console.log(interaction.data);
  if (interaction.data.name == 'status') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        embeds: [
          (new Discord.MessageEmbed()
          .setColor("#42454d")
          .setURL('https://thunderbot.cf/status/ventbot')
          .setDescription(`You can view the status of VentBot at https://thunderbot.cf/status/ventbot.`)
          .setAuthor('VentBot Status', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1', 'https://thunderbot.cf/status/ventbot')
          .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
          .setTimestamp()
          ).toJSON()
        ]
      }
    }});
  }
  if (interaction.data.name == 'support') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        embeds: [
          (new Discord.MessageEmbed()
          .setColor("#42454d")
          .setURL('https://discord.gg/TBsdr4wKkG')
          .setDescription(`Join the official VentBot support server at https://discord.gg/TBsdr4wKkG.`)
          .setAuthor('Get Support', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1', 'https://discord.gg/TBsdr4wKkG')
          .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
          .setTimestamp()
          ).toJSON()
        ]
      }
    }});
  }
  if (interaction.data.name == 'invite') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        embeds: [
          (new Discord.MessageEmbed()
          .setColor("#42454d")
          .setURL('https://discord.com/oauth2/authorize?client_id=831919544846123008&permissions=289856&scope=bot%20applications.commands')
          .setDescription(`[Click here](https://discord.com/oauth2/authorize?client_id=831919544846123008&permissions=289856&scope=bot%20applications.commands) to invite VentBot to your server.`)
          .setAuthor('Invite ThunderBot', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1', 'https://discord.com/oauth2/authorize?client_id=831919544846123008&permissions=289856&scope=bot%20applications.commands')
          .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
          .setTimestamp()
          ).toJSON()
        ]
      }
    }});
  }
  if (interaction.data.name == 'vote') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        embeds: [
          (new Discord.MessageEmbed()
          .setColor("#42454d")
          .setURL('https://top.gg/bot/831919544846123008')
          .setDescription(`Vote for VentBot by visiting https://top.gg/bot/831919544846123008. Every vote gives you 10 credits, and you can get more VentBot features with credits!`)
          .setAuthor('Vote for VentBot', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1', 'https://top.gg/bot/831919544846123008')
          .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
          .setTimestamp()
          ).toJSON()
        ]
      }
    }});
  }
  if (interaction.data.name == 'website') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        embeds: [
          (new Discord.MessageEmbed()
          .setColor("#42454d")
          .setURL('https://thunderbot.cf/vent')
          .setDescription(`Visit the VentBot website at https://thunderbot.cf/vent.`)
          .setAuthor('VentBot Website', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1', 'https://thunderbot.cf/status/ventbot')
          .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
          .setTimestamp()
          ).toJSON()
        ]
      }
    }});
  }
  if (interaction.data.name == 'help') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
        embeds: [
          (new Discord.MessageEmbed()
          .setColor("#42454d")
          .setURL('https://thunderbot.cf/status/ventbot')
          .addField('Commands', `:grey_question: ${code('/help')} : Bring up the help menu\n:paperclip: ${code('/link [#channel]')} : Link the venting channel\n:timer: ${code('/delay [seconds]')} : Set the delay in seconds\n:wastebasket: ${code('/button')} : Toggle delete button\n:gear: ${code('/status')} : See VentBot status and uptime\n\`➕\`‌${code('/invite')} : Invite VentBot to your server\n:man_raising_hand: ${code('/support')} : Join the VentBot support server\n:globe_with_meridians: ${code('/website')} : Visit the VentBot website\n:ballot_box: ${code('/vote')} : Vote for VentBot for additional features`)
          .setAuthor('VentBot Help', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1', 'https://thunderbot.cf/status/ventbot')
          .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
          .setTimestamp()
          ).toJSON()
        ]
      }
    }});
  }
  if (interaction.data.name == 'button') {
    if (!(new Discord.Permissions(parseInt(interaction.member.permissions))).has('MANAGE_MESSAGES')) {
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`You must have server-wide **Manage Messages** permissions to use this command.`)
              .setAuthor('Insufficient Permissions', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    }
    var button = await db.get('guilds.' + interaction.guild_id + '.button');
    if (button) {
      await db.set('guilds.' + interaction.guild_id + '.button', false);
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`The delete button has been disabled.`)
              .setAuthor('Button Disabled', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    } else {
      await db.set('guilds.' + interaction.guild_id + '.button', true);
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`The delete button has been enabled.`)
              .setAuthor('Button Enabled', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    }
  }
  if (interaction.data.name == 'link') {
    if (!(new Discord.Permissions(parseInt(interaction.member.permissions))).has('MANAGE_MESSAGES')) {
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`You must have server-wide **Manage Messages** permissions to use this command.`)
              .setAuthor('Insufficient Permissions', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    }
    if (interaction.data.options && interaction.data.options[0].name == "channel") {
      var channel = interaction.data.options[0].value;
    } else {
      var channel = interaction.channel_id;
    }
    await db.set('guilds.' + interaction.guild_id + '.channel', channel);
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`Vent channel linked to <#${channel}>.`)
              .setAuthor('Channel Linked', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
  }
  if (interaction.data.name == 'delay') {
    if (!(new Discord.Permissions(parseInt(interaction.member.permissions))).has('MANAGE_MESSAGES')) {
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`You must have server-wide **Manage Messages** permissions to use this command.`)
              .setAuthor('Insufficient Permissions', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    }
    if (interaction.data.options && interaction.data.options[0].name == "delay") {
      var delay = interaction.data.options[0].value;
      await db.set('guilds.' + interaction.guild_id + '.delay', delay * 1000);
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`Vent close delay set to ${delay} seconds.`)
              .setAuthor('Delay Set', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    } else {
      var delay = await db.get('guilds.' + interaction.guild_id + '.delay');
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
          embeds: [
            (new Discord.MessageEmbed()
              .setColor("#42454d")
              .setDescription(`The current vent close delay is ${Math.floor(delay / 1000)} seconds. To set the vent close delay, use ${code(prefix + 'delay [seconds]')}.`)
              .setAuthor('Vent Close Delay', 'https://cdn.discordapp.com/emojis/831939773781377026.gif?v=1')
              .setFooter(client.guilds.cache.get(interaction.guild_id).name, client.guilds.cache.get(interaction.guild_id).iconURL())
              .setTimestamp()).toJSON()
          ]
        }
      }});
    }
  }
});

client.login(process.env.TOKEN);
