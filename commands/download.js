const { MessageEmbed } = require('discord.js');
const fs = require('fs');

exports.run = message => {
	const links = JSON.parse(fs.readFileSync('./links.json', { encoding: 'utf8' }));

	const embed = new MessageEmbed() // eslint-disable-line no-unused-vars
		.setTitle(`Download Links`)
		.setColor('RANDOM')
		.setDescription(`**Google Drive**\
${links.urlX32 ? `\n📂 Windows x86: [Click](${links.urlX32})` : ''}
${links.urlX64 ? `\n📂 Windows x64: [Click](${links.urlX64})` : ''}
${links.urlMac ? `\n📂 Mac: [Click](${links.urlMac})` : ''}
${links.urlLinux ? `\n📂 Linux: [Click](${links.urlLinux})` : ''}
${links.urlAndroid ? `\n📂 Android: [Click](${links.urlAndroid})` : ''}`);

	message.channel.send(embed).catch(console.error);
	// message.channel.send(`Download for P1 not yet available. You should <#366714491582283778>`).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['dl'],
	permLevel: 0
};

exports.help = {
	name: 'download',
	description: 'Displays all the available download links for P1',
	usage: 'download'
};
