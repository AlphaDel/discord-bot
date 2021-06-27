'use strict';
require('dotenv').config();
const Discord = require('discord.js');
const { ROLES_ID } = require('./constants');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on(process.env.DEBUG, (msg) => console.debug(msg));

client.on('guildMemberAdd', (member) => {
  const roleForNewMember = member.guild.roles.cache.find(
    (role) => role.id === ROLES_ID.HIPSTER
  );
  member.roles.add(roleForNewMember);
  console.info(
    `[log]: added new member role for [${member.user.id}:${member.user.username}]`
  );
});

client.login(process.env.BOT_TOKEN);
