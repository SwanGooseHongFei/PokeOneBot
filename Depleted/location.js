const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const settings = require('../settings.json');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a location - use **${settings.prefix}help location** for more info!`);
	}

	const search = args.splice(0, args.length).join(' ').toLowerCase();

	const embed = new MessageEmbed()
		.setTitle(`${Region} || ${Location}`)
		.addField(`Spawns`, `${spawnList}`, true)
		.addField(`berries`, `${berryList}`, true)
		.addField(`Items`, `${itemList}`);

	/* IF LOCATION NOT FOUND (404)
	if (body.status == '404') {
		return message.channel.send(`Location: ${search} not found. Please double check spelling!`);
	} */

	message.channel.send('This is a Placeholder!', { embed }).catch(console.error);


};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['loc'],
	permLevel: 0
};

exports.help = {
	name: 'location',
	description: 'Give information on given location',
	usage: 'location [location name]'
};
