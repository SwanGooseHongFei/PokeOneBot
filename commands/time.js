const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async message => {
	const route = 'timeevents';
	const apifull = `${settings.api.url}/${route}${settings.api.token}`;
	const { body } = await snekfetch.get(apifull);

	const embed = new MessageEmbed()
		.setTitle(`Timed Events || ${body.day}`)
		.addField('Daily Reset', `${body.dailyReset}`, true)
		.addField('Contests', `**Bug Contest:** ${body.bug}`, true)
		.addField('S.S. Aqua', `**To Olivine:** ${body.olivine}\n**To Vermilion:** ${body.vermilion}`, true)
		.addField('Week Siblings', `**Monday:** ${body.mon}\n**Tuesday:** ${body.tue}\n**Wednesday:** ${body.wed}
**Thursday:** ${body.thur}\n**Friday:** ${body.fri}\n**Saturday:** ${body.sat}\n**Sunday:** ${body.sun}`, true)
		.addField('Underground', `**Hairdresser 1:** ${body.hairdresser1}\n**Hairdresser 2:** ${body.hairdresser2}
**Herb Shop:** ${body.herbshop}`, true)
		.addField('Maps', `**Union Cave BF2:** ${body.unioncaveb2f}\n**Lake of Rage:** ${body.rage}
**MooMoo Farm:** ${body.moomoofarm}`, true);

	message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'time',
	description: 'Gives information on when timed events begin and end',
	usage: 'time'
};
