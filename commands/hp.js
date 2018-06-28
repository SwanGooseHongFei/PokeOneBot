const settings = require('../settings.json');
const { MessageEmbed } = require('discord.js');

exports.run = (message, args) => {
	let [HPIV, AttackIV, DefenseIV, SpAtkIV, SpDefIV, SpeedIV] = args;

	if (args.length !== 6) {
		return message.channel.send(`Please input exactly 6 valid IVs. Input your Pokemon's IVs separated by a space: \
**${settings.prefix}hp 23 19 16 7 16 20** - use **${settings.prefix}help hp** for more info!`).catch(console.error);
	}


	if (HPIV > 31 || AttackIV > 31 || DefenseIV > 31 || SpeedIV > 31 || SpAtkIV > 31 || SpDefIV > 31) {
		return message.channel.send(`One or more of the given IVs is higher then 31. Please check your IVs and try \
again - use **${settings.prefix}help hp** for more info!!`).catch(console.error);
	}

	if (isNaN(HPIV) || isNaN(AttackIV) || isNaN(DefenseIV) || isNaN(SpeedIV) || isNaN(SpAtkIV) || isNaN(SpDefIV)) {
		return message.channel.send('One or more of the given IVs is not a number!').catch(console.error);
	}

	/* if (isNaN(HPIV)) {
		return message.channel.send('Your HP IV must be a number!')
  	}
  	if (isNaN(AttackIV)) {
		return message.channel.send('Your Attack IV must be a number!')
  	}
  	if (isNaN(DefenseIV)) {
		return message.channel.send('Your Defense IV must be a number!')
  	}
  	if (isNaN(SpeedIV)) {
		return message.channel.send('Your Speed IV must be a number!')
  	}
  	if (isNaN(SpAtkIV)) {
		return message.channel.send('Your Special Attack IV must be a number!')
  	}
  	if (isNaN(SpDefIV)) {
		return message.channel.send('Your Special Defense IV must be a number!')
  	} */

	HPIV %= 2;
	AttackIV %= 2;
	DefenseIV %= 2;
	SpeedIV %= 2;
	SpAtkIV %= 2;
	SpDefIV %= 2;

	const tota = Math
		.floor(((HPIV + (2 * AttackIV) + (4 * DefenseIV) + (8 * SpeedIV) + (16 * SpAtkIV) + (32 * SpDefIV)) * 15) / 63);

	const hiddenPower = [
		{ type: 'Fighting', color: 0xDC7633 },
		{ type: 'Flying', 	color: 0x9696FF },
		{ type: 'Poison', 	color: 0xC814FF },
		{ type: 'Ground', 	color: 0xC89B00 },
		{ type: 'Rock', 	color: 0xE59866 },
		{ type: 'Bug', 		color: 0x007D00 },
		{ type: 'Ghost', 	color: 0x640096 },
		{ type: 'Steel', 	color: 0x646464 },
		{ type: 'Fire', 	color: 0xFF9600 },
		{ type: 'Water', 	color: 0x0000C8 },
		{ type: 'Grass', 	color: 0x00C800 },
		{ type: 'Electric', color: 0xE7C332 },
		{ type: 'Psychic', 	color: 0xF032E1 },
		{ type: 'Ice', 		color: 0x32E7E4 },
		{ type: 'Dragon', 	color: 0x9B32E7 },
		{ type: 'Dark', 	color: 0x5A4326 }
	];

	if (tota < hiddenPower.length) {
		const embed = new MessageEmbed()
			.setTitle('Hidden Power')
			.setColor(hiddenPower[tota].color)
			.setDescription(`Type: ${hiddenPower[tota].type}`);

		return message.channel.send(embed).catch(console.error);
	}
	return 1;
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'hp',
	description: 'Gives Hidden Power type based on IVs that are given. IVs must be between 0 and 31.',
	usage: 'hp [HP IV] [ATK IV] [DEF IV] [SPATK IV] [SPDEF IV] [SPEED IV]'
};
