'use strict';

const Discord = require('discord.js');
const dotaServices = require('../services/dota-services');
const { GAME_MODE } = require('../constants');

module.exports = {
  name: 'dota-recentmatches',
  aliases: ['drms'],
  description: 'แสดงข้อมูลแมตช์ล่าสุดของผู้เล่น Dota2',
  guildOnly: false,
  inactive: false,
  args: true,
  cooldown: 10,
  usage: '[account id] หรือ steam friend code',
  async execute(message, args) {
    try {
      const { data } = await dotaServices.getRecentMatches(args[0]);
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#E84330')
        .setTitle(`Dota2 recent matches [${args[0]}]`)
        .addFields(
          ...data.splice(0, 3).map((match) => [
            {
              name: 'Match ID',
              value: match.match_id,
            },
            {
              name: 'Game mode',
              value: GAME_MODE[match.game_mode],
            },
            {
              name: 'Team won',
              value: match.radiant_win ? 'Radiant' : 'Dire',
            },
            {
              name: 'K/D/A',
              value: `${match.kills}/${match.deaths}/${match.assists}`,
            },
            {
              name: 'GMP/XMP',
              value: `${match.gold_per_min}/${match.xp_per_min}`,
            },
            {
              name: 'Last hits',
              value: `${match.last_hits}`,
            },
            {
              name: '---------------------',
              value: '\u200B',
            },
          ])
        )
        .setTimestamp()
        .setFooter(
          'Data from opendota.com',
          'https://lh5.googleusercontent.com/QaIylbW8t1kjfL6bUv7HAp03vaKm3J50ezSFimJwdmSfeCmq_zWj7POo4X3orzKiipEFCi0TgSINV5tuYxaU=w1718-h1280'
        );

      message.channel.send(exampleEmbed);
    } catch (error) {
      console.error(error);
      message.channel.send(
        'ไม่พบข้อมูลผู้เล่น โปรดตรวจสอบ account id แล้วลองใหม่อีกครั้ง'
      );
    }
  },
};
