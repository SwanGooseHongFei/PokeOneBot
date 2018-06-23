const settings = require('../settings.json');

exports.run = (message, params) => {
	const client = message.client;

	if (!params[0]) {
		const commandNames = Array.from(client.commands.keys());
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		let commandList = [];
		commandNames.forEach(command => {
			const cmd = client.commands.get(command);
			if (client.elevation(message) >= cmd.conf.permLevel) {
				commandList.push(client.commands.get(command));
			}
		});

		return message.channel.send(`= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]
${commandList.map(c => `${settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: \
${c.conf.enabled ? `${c.help.description}` : 'Disabled'}`).join('\n')}`, { code: 'asciidoc' })
			.catch(console.error);
	} else {
		let command = params[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);

			if (client.elevation(message) < command.conf.permLevel) {
				return message.channel.send(`You do not have access to this command!`)
					.catch(console.error);
			}

			let aliases = [];
			if (!command.conf.aliases[0]) {
				aliases = 'None';
			} else {
				aliases = command.conf.aliases.join(', ');
			}
			return message.channel.send(`= Command: ${command.help.name} = \n${command.help.description}
Usage: ${settings.prefix}${command.help.usage}\nAlternatives: ${aliases}`, { code: 'asciidoc' })
				.catch(console.error);
		} else {
			return message.channel.send(`Command: ${params[0]} not found. Please double check spelling!`)
				.catch(console.error);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['h', 'commands', 'pain'],
	permLevel: 0
};

exports.help = {
	name: 'help',
	description: 'Displays all the available commands and more info on single commands',
	usage: 'help [command]'
};
