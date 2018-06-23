const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (client, message, args) => {
	if (!args[0]) {
		return message.channel
			.send(`Please input a quest name or region - use **${settings.prefix}help quest** for more info!`)
			.catch(console.error);
	}

	const search = args.splice(0, args.length).join(' ').toLowerCase();
	const route = 'quest';
	const apifull = `${settings.api.url}/${route}/${search}${settings.api.token}`;
	const { body } = await snekfetch.get(apifull);

	if (body.status === '404') {
		return message.channel.send(`Quest/Region: ${search} not found. Please double check spelling!`)
			.catch(console.error);
	}

	if (body.data.type === 'quest') {
		const embed = new MessageEmbed()
			.setTitle(` ${body.data.name} || Part ${body.data.part}`)
			.setColor('RANDOM')
			.setDescription(`${body.data.description}\nStart: ${body.data.startloc}`)
			.addField('Quest Rewards', `${body.data.rewards.join(', ')}`)
			.setFooter(`Information by: ${client.users.get('115408700625256454').username}`,
				client.users.get('115408700625256454').avatarURL);

		return message.channel.send(embed).catch(console.error);
	} else if (body.data.type === 'region') {
		const embed = new MessageEmbed()
			.setTitle(`Quests in ${body.data.region}`)
			.setColor('RANDOM')
			.addField('Quests Page 1', `${body.data.quests1.join('\n')}`, true)
			.addField('Quests Page 2', `${body.data.quests2.join('\n')}`, true)
			.setFooter(`Information by: ${client.users.get('115408700625256454').username}`,
				client.users.get('115408700625256454').avatarURL);

		return message.channel.send(embed).catch(console.error);
	}

	return message.channel.send(`Oops! Something went wrong!`).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['q'],
	permLevel: 0
};

exports.help = {
	name: 'quest',
	description: 'Gives information on given quest/lists quests in given region',
	usage: 'quest [quest name/region]'
};
