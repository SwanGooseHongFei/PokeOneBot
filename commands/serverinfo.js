const { MessageEmbed } = require('discord.js');

exports.run = message => {
	const afkchan = message.guild.afkChannel || 'None';
	const embed = new MessageEmbed()
		.setTitle(`${message.guild.name} Information`)
		.setThumbnail(message.guild.iconURL({ format: 'png', size: 256 }))
		.setDescription(`**Created:** ${message.guild.createdAt}`)
		.addField(`Stats`, `**Users:** ${message.guild.members.size}\n**Channels:** ${message.guild.channels.size}
**AFK Channel:** ${afkchan}\n**AFK Timer:** ${(message.guild.afkTimeout / 60)} mins`, true)
		.addField(`Roles`, `${message.guild.roles.map(r => r.name).join('\n')}`, true)
		.setFooter(`Owner: ${message.guild.owner.user.tag}`,
			message.guild.owner.user.displayAvatarURL({ format: 'png', size: 256 }));

	message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['sinfo'],
	permLevel: 0
};

exports.help = {
	name: 'serverinfo',
	description: 'Displays information on the current Discord Server',
	usage: 'serverinfo'
};
