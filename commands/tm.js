const settings = require('../settings.json');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a Pokemon - use **${settings.prefix}help tm** for more info!`)
			.catch(console.error);
	}
	var search = args.splice(0, args.length);
	var isShiny = false;
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

	let tmList = [];

	const hms = `HM08 - Rock Climb,\
HM09 - Flash,\
HM10 - Defog,\
HM11 - Whirlpool`.split(',');

	const hmList = [];

	for (let index = 0; index < body.info.move_learnsets[0].tm_learnset.length; index++) {
		if (body.info.move_learnsets[0].tm_learnset[index].tm) {
			var skip = false;
			hms.forEach(element => {
				if (element.substring(7) === body.info.move_learnsets[0].tm_learnset[index].move) {
					hmList.push(element);
					skip = true;
				}
			});

			if (body.info.move_learnsets[0].tm_learnset[index].tm.charAt(0) === 'H') {
				hmList.push(`${body.info.move_learnsets[0].tm_learnset[index].tm} \
${body.info.move_learnsets[0].tm_learnset[index].move}`);
				skip = true;
			}
			if (!skip) {
				tmList.push(`${body.info.move_learnsets[0].tm_learnset[index].tm} \
${body.info.move_learnsets[0].tm_learnset[index].move}`);
			}
		}
	}

	hmList.sort();
	hmList.reverse();

	hmList.forEach(element => {
		tmList.unshift(element);
	});

	if (!tmList.length) {
		tmList = `${body.info.names} cannot learn any TMs nor HMs!`;
	}

	// able to split into two columns with 2 lines of code rather than like 20
	let tmListTwo = [];

	tmListTwo = tmList.splice((tmList.length + (tmList.length % 2)) / 2,
		tmList.length - ((tmList.length - (tmList.length % 2)) / 2)) || '\u200b';

	const embed = new MessageEmbed()
		.setTitle(`#${body.info.national_id} || ${body.info.name} || ${body.info.types.join('/')}`)
		.setColor(0x0000C8)
		.addField('TM/HM List', tmList, true)
		.addField('\u200b', tmListTwo, true)
		.setThumbnail(`${isShiny ? settings.shinyImages : settings.images}\
${body.info.name.toLowerCase().replace(/\W/g, '')}.gif`);

	return message.channel.send('Gen 7 Pokemon may have wrong TM\'s HM\'s ATM!', { embed }).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['hm'],
	permLevel: 0
};

exports.help = {
	name: 'tm',
	description: `Lists the available TMs and HMs that can be learnt by given Pokemon`,
	usage: 'tm [pokemon name]'

};
