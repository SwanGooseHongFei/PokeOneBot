const { MessageEmbed } = require('discord.js');

exports.run = (message, args) => {
	const member = message.mentions.members.first() ||
		message.guild.members.find(mem => mem.user.username === args[0]);

	const searchUser = member ? member.user : message.author;
	const searchMember = member ? member : message.member;

	const embed = new MessageEmbed()
		.setTitle(`${searchUser.tag} Information`)
		.setThumbnail(`${searchUser.displayAvatarURL({ format: 'png', size: 256 })}`)
		.setDescription(`**Created:** ${searchUser.createdAt}\n**Joined:** ${searchMember.joinedAt}`)
		.addField(`User Stats`, `**Status:**\n${searchUser.presence.status}\n\n**ID:**\n${searchUser.id}\n\n**Bot:**
${searchUser.bot}`, true)
		.addField(`Member Stats`, `**Top Role:**\n${searchMember.highestRole}\n\n**Display Name:**
${searchMember.displayName}\n\n**Roles:**\n${searchMember.roles.map(r => r.name).join('\n')}`, true);

	message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['uinfo'],
	permLevel: 0
};

exports.help = {
	name: 'userinfo',
	description: 'Displays information on your Discord Account',
	usage: 'userinfo'
};
