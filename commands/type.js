const settings = require('../settings.json');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

exports.run = async (message, args) => {
	if (!args[0]) {
		return message.channel.send(`Please input a valid type - use **${settings.prefix}help type** for more info!`)
			.catch(console.error);
	}

	if (!args[1]) {
		const search = args.splice(0, args.length).join(' ').toLowerCase();
		const route = 'types';
		const apifull = `${settings.api.url}/${route}/${search}`;
		const { body } = await snekfetch.get(apifull, settings.api.options).catch(console.error);

		if (body.status === '404') {
			return message.channel.send(`Type: ${search} not found. Please double check spelling!`)
				.catch(console.error);
		}

		const deals = [];
		const takes = [];

		for (let index = 0; index < 18; index++) {
			let array = body.info.attacking[index].split(' ');
			deals.push(`${array[1]}x to ${array[0]}`);

			array = body.info.defending[index].split(' ');
			takes.push(`${array[1]}x to ${array[0]}`);
		}

		const embed = new MessageEmbed()
			.setTitle(`${body.info.name}`)
			.setColor(parseInt(body.info.colour, 16))
			.addField(`__Deals:__`, deals, true)
			.addField(`__Takes:__`, takes, true);

		return message.channel.send(embed).catch(console.error);
	}

	const searchOne = args[0] ? args[0].toLowerCase() : '';
	const searchTwo = args[1] ? args[1].toLowerCase() : '';
	const route = 'types';
	const apiOne = `${settings.api.url}/${route}/${searchOne}${settings.api.token}`;
	const apiTwo = `${settings.api.url}/${route}/${searchTwo}${settings.api.token}`;
	let { body } = await snekfetch.get(apiOne, settings.api.options).catch(console.error);

	const [dealsOne, dealsTwo, takesOne, takesTogether] = [
		[],
		[],
		[],
		[]
	];


	let name = '';

	if (body.status === '404' && searchOne) {
		return message.channel.send(`Type: ${searchOne} not found. Please double check spelling!`)
			.catch(console.error);
	}

	for (let index = 0; index < 18; index++) {
		const array = body.info.attacking[index].split(' ');
		dealsOne.push(`${array[1]}x to ${array[0]}`);
		takesOne.push(body.info.defending[index].split(' ')[1]);
	}
	name = body.info.name;
	const colour = body.info.colour;

	let { body2 } = await snekfetch.get(apiTwo, settings.api.options).catch(console.error);

	if (body2.status === '404' && searchTwo) {
		return message.channel.send(`Type: ${searchTwo} not found. Please double check spelling!`)
			.catch(console.error);
	}

	for (let index = 0; index < 18; index++) {
		const array = body2.info.attacking[index].split(' ');
		dealsTwo.push(`${array[1]}x to ${array[0]}`);

		const firstTypeMultiplier = takesOne[index];
		const secondTypeMultiplier = body2.info.defending[index].split(' ')[1];
		const finalMultiplier = parseFloat(firstTypeMultiplier) * parseFloat(secondTypeMultiplier);
		takesTogether.push(`${finalMultiplier}x from ${body2.info.defending[index].split(' ')[0]}`);
	}
	name += `/${body2.info.name}`;

	const embed = new MessageEmbed()
		.setTitle(name)
		.setColor(parseInt(colour, 16))
		.addField(`__${name.split('/')[0]} Deals:__`, dealsOne, true)
		.addField(`__${name.split('/')[1]} Deals:__`, dealsTwo, true)
		.addField(`__Together Takes:__`, takesTogether, true);

	return message.channel.send(embed).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['chart', 'typ', 'typechart'],
	permLevel: 0
};

exports.help = {
	name: 'type',
	description: `Lists type advantages and disadvantages for given type, or type combination`,
	usage: 'type [type]'

};
