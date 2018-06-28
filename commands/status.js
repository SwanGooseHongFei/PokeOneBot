const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async message => {
	const route = 'status';
	const apifull = `${settings.api.url}/${route}`;
	const { body } = await snekfetch.get(apifull, settings.api.options).catch(console.error);

	const embed = new MessageEmbed()
		.setTitle(`PokéOne Server Status`)
		.addField('Gameserver', `${body.server.reachable ? '✅ Online' : '❌ Offline'}`)
		.addField('Website', `${body.website.reachable ? '✅ Online' : '❌ Offline'}`, true);

	message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'status',
	description: 'Gives information on the current server status',
	usage: 'status'
};
