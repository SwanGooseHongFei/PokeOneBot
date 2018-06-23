const { MessageEmbed } = require('discord.js');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Use **${settings.prefix}help player** for more info on how to use this command!`)
			.catch(console.error);
	}

	args[0] = args[0].toLowerCase();

	const { database } = message.client;
	const guild = args[2] || 'None';

	if (!args[1]) {
		return message.channel.send('Please redo the command with your PlayerName and Guild [Optional]')
			.catch(console.error);
	}

	if (args[0] === 'add') {
		const result = await database.player.findById(message.author.id);

		if (result) {
			return message.channel.send('You are already in the database!\n__This is still under development!__')
				.catch(console.error);
		}

		const player = database.player.create({
			userId: message.author.id,
			gamename: args[1],
			guild
		});

		return message.channel.send(`Player \`${player.gamename}\` added!\n__This is still under development!__`);
	} else if (args[0] === 'update') {
		const result = await database.player.findById(message.author.id);

		if (!result) {
			return message.channel.send('You are not in the database yet!\n__This is still under development!__')
				.catch(console.error);
		}

		let player = result.update({
			gamename: args[1],
			guild
		});

		return message.channel.send(`Player \`${player.gamename}\` updated!\n__This is still under development!__`);
	} else {
		const result = await database.user.findById(message.author.id);

		if (!result) {
			return message.channel.send('The specified player wasnt found!\n__This is still under development!__')
				.catch(console.error);
		}

		const embed = new MessageEmbed()
			.setTitle(`${result.gamename} || ${result.guild}`)
			.setDescription('more data coming soon!');

		return message.channel.send(embed).catch(console.error);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0
};

exports.help = {
	name: 'player',
	description: `Displays a player's information`,
	usage: `player [player's name]`
};
