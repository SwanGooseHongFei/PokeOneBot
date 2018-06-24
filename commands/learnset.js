const settings = require('../settings.json');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a Pokemon - use **${settings.prefix}help learnset** for more info!`)
			.catch(console.error);
	}
	let search = args.splice(0, args.length);
	let isShiny = false;
	if (search[0].toLowerCase() === 'shiny') {
		search.splice(0, 1);
		isShiny = true;
	}
	search = search.join(' ').toLowerCase();
	const route = 'pokemon';
	const apifull = `${settings.api.url}/${route}/${search}${settings.api.token}`;
	const { body } = await snekfetch.get(apifull);

	if (body.status === '404') {
		return message.channel.send(`Pokemon: ${search} not found. Please double check spelling!`)
			.catch(console.error);
	}

	let array = [];
	for (let index = 0; index < body.info.move_learnsets[1].regular_learnset.length; index++) {
		if (body.info.move_learnsets[1].regular_learnset[index].level) {
			array[index] = `Lvl. ${body.info.move_learnsets[1].regular_learnset[index].level} - \
${body.info.move_learnsets[1].regular_learnset[index].move}`;
		}
	}

	if (array.length === 0) {
		array = 'API error';
	}

	const embed = new MessageEmbed()
		.setTitle(`#${body.info.national_id} || ${body.info.name} || ${body.info.types.join('/')}`)
		.setColor(0x0000C8)
		.addField('Levelling Learnset List', array);
	if (isShiny) {
		embed.setThumbnail(`${settings.shinyImages}${body.info.name.toLowerCase().replace(/\W/g, '')}.gif`);
	} else {
		embed.setThumbnail(`${settings.images}${body.info.name.toLowerCase().replace(/\W/g, '')}.gif`);
	}
	return message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['level', 'learn', 'set'],
	permLevel: 0
};

exports.help = {
	name: 'learnset',
	description: `Lists moves that can be learnt by given Pokemon by level`,
	usage: 'learnset [pokemon name]'

};
