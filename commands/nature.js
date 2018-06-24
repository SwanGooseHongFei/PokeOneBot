const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a nature - use **${settings.prefix}help nature** for more info!`)
			.catch(console.error);
	}
	const search = args.splice(0, args.length).join(' ').toLowerCase();
	const route = 'nature';
	const apifull = `${settings.api.url}/${route}/${search}${settings.api.token}`;
	const { body } = await snekfetch.get(apifull);

	if (body.status === '404') {
		return message.channel.send(`Nature: ${search} not found. Please double check spelling!`);
	}

	const embed = new MessageEmbed()
		.setTitle(`${body.data.name}`)
		.addField(`__Increases:__`, `${body.data.increase}`, true)
		.addField(`__Decreases:__`, ` ${body.data.decrease}`, true)
		.addField(`\u200b`, `Pokémon with the ${body.data.name} Nature Like: ${body.data.likes} and Dislike: \
${body.data.dislikes}`);

	return message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['n'],
	permLevel: 0
};

exports.help = {
	name: 'nature',
	description: 'Gives information on given nature',
	usage: 'nature [nature]'
};
