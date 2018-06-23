const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		message.channel.send(`Please input a guild name - use **${settings.prefix}help ability** for more info!`);
		return;
	}

	const search = args.splice(0, args.length).join(' ').toLowerCase();
	const route = 'guilds';
	const apifull = `${settings.api.url}/${route}/${search}${settings.api.token}`;

	const { body } = await snekfetch.get(apifull);
	const glink = body.data.link || 'https://discord.gg/bNYRTFn';
	const checkOwners = `Guild Owner${body.data.owner.length < 2 ? '' : 's'}`;
	const guildpic = body.data.img || 'http://api.gamernationnetwork.xyz/pokemon/guildlogos/nologo.png';

	if (body.status === '404') {
		message.channel.send(`Guild: ${search} not found. Please double check spelling!`);
		return;
	}

	const embed = new MessageEmbed()
		.setTitle(`${body.data.name} (${body.data.nick})`)
		.setDescription(`**${checkOwners}:** ${body.data.owner.join(', ')}\n**Motto:** ${body.data.motto}`)
		.setColor(body.data.colour)
		.setURL(glink)
		.setThumbnail(guildpic);

	message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['guilds', 'g'],
	permLevel: 0
};

exports.help = {
	name: 'guild',
	description: 'Gives information on given guild',
	usage: 'guild [guild name]'
};
