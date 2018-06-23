/* eslint-disable complexity */

const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a Pokemon - use **${settings.prefix}help pokemon** for more info!`);
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

	const abilities = [];
	let evolutions = [];
	let prevolution = [];

	if (!body.info.evolutions) {
		evolutions = `N/A`;
	} else {
		for (let index = 0; index < body.info.evolutions.length; index++) {
			// Temporary holder for the evolution and method
			let evo = '';

			// Who is it evolving to?
			const name = body.info.evolutions[index].to;
			evo += `**${name}**`;

			// Does it require trading?
			const trading = body.info.evolutions[index].trade;
			if (trading) {
				evo += ' by trading';
			}

			// Does it need an item to be used on it?
			const item = body.info.evolutions[index].item;
			if (item) {
				evo += ` using a${/[aeiouAEIOU]/.test(item.charAt(0)) ? 'n' : ''} ${item}`;
			}

			// Does it need to hold an item?
			const holdItem = body.info.evolutions[index].hold_item;
			if (holdItem) {
				evo += ` whilst holding a${/[aeiouAEIOU]/.test(item.charAt(0)) ? 'n' : ''} ${holdItem}`;
			}

			// What minimum level does it need?
			const level = body.info.evolutions[index].level;
			if (level) {
				evo += ` starting at level ${level}`;
			}

			// Does it require a level up to trigger?
			const levelUp = body.info.evolutions[index].level_up;
			if (levelUp) {
				evo += ' after a level up';
			}

			// Does it need happiness?
			const happy = body.info.evolutions[index].happiness;
			if (happy) {
				evo += ' with at least 220 friendship';
			}

			// Does it need a specific move?
			const move = body.info.evolutions[index].move_learned;
			if (move) {
				evo += ` knowing the move ${move}`;
			}

			// Does it need to satisfy certain conditions?
			const conditions = [];
			if (body.info.evolutions[index].conditions) {
				for (let i = 0; i < body.info.evolutions[index].conditions.length; i++) {
					conditions[i] = body.info.evolutions[index].conditions[i];
				}

				if (conditions) {
					evo += ` ${conditions.join(', ')}`;
				}
			}

			// After writing, add to list of evolutions
			evolutions[index] = evo;
		}
	}

	prevolution = body.info.evolution_from || 'N/A';

	for (let index = 0; index < body.info.abilities.length; index++) {
		abilities[index] = `${body.info.abilities[index].name} ${body.info.abilities[index].hidden ? '[Hidden]' : ''}`;
	}

	const stats = `HP: ${body.info.base_stats.hp},\
ATK: ${body.info.base_stats.atk},\
DEF: ${body.info.base_stats.def},\
SPATK: ${body.info.base_stats.sp_atk},\
SPDEF: ${body.info.base_stats.sp_def},\
SPEED: ${body.info.base_stats.speed}`.split(',');

	const evTemp = `HP: ${body.info.ev_yield.hp},\
ATK: ${body.info.ev_yield.atk},\
DEF: ${body.info.ev_yield.def},\
SPATK: ${body.info.ev_yield.sp_atk},\
SPDEF: ${body.info.ev_yield.sp_def},\
SPEED: ${body.info.ev_yield.speed}`.split(',');

	const id = body.info.national_id.toString().padStart(3, '0');

	const eggGroup = body.info.egg_groups;
	const genderRatios = body.info.gender_ratios ? `Male: ${body.info.gender_ratios.male}% |\
Female: ${body.info.gender_ratios.female}%` : 'Genderless';

	const embed = new MessageEmbed()
		.setTitle(`#${id} || ${body.info.name} || ${body.info.types.join('/')}`)
		.setColor(0x0000C8);

	if (body.info.isGlitch) {
		embed.addField(`__${body.info.encoder[0]}:__`, stats.join(', '), true)
			.addField(`__${body.info.encoder[1]}:__`, evTemp.join(', '), true)
			.addField(`__${body.info.encoder[2]}:__`, abilities, false)
			.addField(`__${body.info.encoder[3]}:__`, prevolution, false)
			.addField(`__${body.info.encoder[4]}:__`, evolutions, true);
		// embed.setThumbnail();
	} else {
		embed.addField(`__Base Stats:__`, stats, true)
			.addField('__EV Yield:__', evTemp, true)
			.addField(`__Weight and Height:__`, `${body.info.height_us}\n${body.info.height_eu}
${body.info.weight_us}\n${body.info.weight_eu}`, true)
			.addField(`__Abilities:__`, abilities, true)
			.addField('__Gender Ratio:__', genderRatios, true)
			.addField(`__Egg Group:__`, eggGroup, true)
			.addField('__Evolves From:__', prevolution, true)
			.addField('__Evolves Into:__', evolutions, false)
			.setThumbnail(`${isShiny ? settings.shinyImages : settings.images}\
${body.info.name.toLowerCase().replace(/\W/g, '')}.gif`);
	}

	return message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['poke', 'p'],
	permLevel: 0
};

exports.help = {
	name: 'pokemon',
	description: 'Gives information on given pokemon',
	usage: 'pokemon [pokemon name]'
};
