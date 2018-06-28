const { MessageEmbed } = require('discord.js');

exports.run = message => {
	const embed = new MessageEmbed()
		.setTitle('Unofficial PokéOne Bot Links')
		.addField('Links', `**Discord:** [Server Link](https://discord.gg/fU9c4k7)
**Bot Invite:** [Invite Link](https://discordapp.com/api/oauth2/authorize?client_id=452994315560681495\
&permissions=0&scope=bot)\n**Github:** [Repository Link](https://github.com/SwanGooseHongFei/PokeOneBot)`);

	message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['link'],
	permLevel: 0
};

exports.help = {
	name: 'links',
	description: 'Provides links for the Unofficial PokeOne Bot',
	usage: 'links'
};
