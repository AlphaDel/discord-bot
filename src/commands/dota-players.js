'use strict';

const Discord = require('discord.js');
const dotaServices = require('../services/dota-services');

module.exports = {
  name: 'dota-players',
  aliases: ['dpinfo'],
  description: 'แสดงข้อมูลของผู้เล่น Dota2',
  guildOnly: false,
  inactive: false,
  args: true,
  cooldown: 10,
  usage: '[account id] หรือ steam friend code',
  async execute(message, args) {
    try {
      const { data } = await dotaServices.getPlayerInfo(args[0]);
      console.log(`data`, data);

      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#E84330')
        .setTitle(`Dota2 player info [${args[0]}]`)
        .setThumbnail(data.profile.avatarfull)
        .addFields(
          {
            name: 'Profile name',
            value: data.profile.personaname,
            inline: true,
          },
          { name: '\u200B', value: '\u200B', inline: true },
          {
            name: 'MMR estimate',
            value: data.mmr_estimate.estimate,
            inline: true,
          },
          {
            name: 'Dota plus',
            value: data.profile.plus ? 'Yes' : 'No',
            inline: true,
          },
          { name: '\u200B', value: '\u200B', inline: true },
          {
            name: 'Country',
            value: data.profile.loccountrycode,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter(
          'Data from opendota.com',
          'https://lh5.googleusercontent.com/QaIylbW8t1kjfL6bUv7HAp03vaKm3J50ezSFimJwdmSfeCmq_zWj7POo4X3orzKiipEFCi0TgSINV5tuYxaU=w1718-h1280'
        );

      message.channel.send(exampleEmbed);
    } catch (error) {
      message.channel.send(
        'ไม่พบข้อมูลผู้เล่น โปรดตรวจสอบ account id แล้วลองใหม่อีกครั้ง'
      );
    }
  },
};
