'use strict';
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { prefix, cooldown } = require('./config.json');
const { ROLES_ID } = require('./constants');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

client.on(process.env.DEBUG, (msg) => console.debug(msg));

const commandFiles = fs
  .readdirSync(path.resolve(__dirname, './commands'))
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  client.user.setPresence({
    activity: { name: '⚡️By Wuttinan!' },
    status: 'online',
  });
  console.log('I am ready!');
});

client.on('guildMemberAdd', (member) => {
  const roleForNewMember = member.guild.roles.cache.find(
    (role) => role.id === ROLES_ID.HIPSTER
  );
  member.roles.add(roleForNewMember);
  console.info(
    `[log]: added new member role for [${member.user.id}:${member.user.username}]`
  );
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandArg = args.shift().toLowerCase();

  try {
    const command =
      client.commands.get(commandArg) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandArg)
      );

    // Handle inactive commands.
    if (!command || command.inactive) return;

    // Handle direct message commands.
    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply(`ไม่สามารถดำเนินการคำสั่ใน DM ได้!`);
    }

    // Handle require arguments.
    if (command.args && !args.length) {
      let reply = `คุณไม่ได้ระบุอาร์กิวเมนต์, ${message.author}!`;

      if (command.usage) {
        reply += `\nตัวอย่างการใช้งานคำสั่ง: \`${prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    // Handle cooldown.
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownTime = (command.cooldown || cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownTime;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `โปรดรอ ${timeLeft.toFixed(1)} วินาที ก่อนใช้งานคำสั่ง \`${
            command.name
          }\` อีกครั้ง`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownTime);

    // Handle execute command.
    command.execute(message, args);

    // client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('มีข้อผิดพลาดในการพยายามดำเนินการคำสั่ง!');
  }
});

client.login(process.env.BOT_TOKEN);
