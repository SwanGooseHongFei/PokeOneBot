const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a move - use **${settings.prefix}help move** for more info!`)
			.catch(console.error);
	}

	const search = args.splice(0, args.length).join('_').toLowerCase();
	const route = 'moves';
	const apifull = `${settings.api.url}/${route}/${search}`;
	const { body } = await snekfetch.get(apifull, settings.api.options).catch(console.error);

	if (body.status === '404') {
		return message.channel.send(`Move: ${search} not found. Please double check spelling!`)
			.catch(console.error);
	}

	var category = body.info.category.charAt(0).toUpperCase() + body.info.category.slice(1);
	var power = body.info.power;
	var acc = body.info.accuracy;
	var crit = body.info.critical_hit;

	if (category === 'Status') {
		power = acc = crit = '−';
	}
	const embed = new MessageEmbed()
		.setTitle(body.info.names.en)
		.setDescription(`${body.info.descriptions.en}`)
		.addField('Move Stats', `**Base Power:** ${power}\n**Accuracy:** ${acc}%\n**Critical:** ${crit}`, true)
		.addField('\u200b', `**PP:** ${body.info.pp} (MAX: ${body.info.max_pp})\n**Type: **${body.info.type}
**Category:** ${body.info.category.charAt(0).toUpperCase()}${body.info.category.slice(1)}`, true);

	return message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['m'],
	permLevel: 0
};

exports.help = {
	name: 'move',
	description: 'Gives information on given move',
	usage: 'move [move name]'
};
