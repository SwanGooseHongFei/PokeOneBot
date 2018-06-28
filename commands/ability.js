const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input an ability - use **${settings.prefix}help ability** for more info!`)
			.catch(console.error);
	}

	const search = args.splice(0, args.length).join(' ').toLowerCase();
	const route = 'ability';
	const apifull = `${settings.api.url}/${route}/${search}`;
	const { body } = await snekfetch.get(apifull, settings.api.options).catch(console.error);

	if (body.status === '404') {
		return message.channel.send(`Ability: ${search} not found. Please double check spelling!`)
			.catch(console.error);
	}

	const embed = new MessageEmbed()
		.setTitle(`__${body.info.name}__`)
		.addField(`Ability Description:`, `${body.info.description}`, false)
		.addField(`Effect:`, `\u200B${body.info.effect}`, false);

	return message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['a'],
	permLevel: 0
};

exports.help = {
	name: 'ability',
	description: 'Gives information on given ability',
	usage: 'ability [ability name]'
};
