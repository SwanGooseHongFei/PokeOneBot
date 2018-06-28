const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
// const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const Database = require('./structures/database');
require('./util/eventLoader')(client);

const log = message => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

const events = ['reconnect', 'disconnect'];
for (let event of events) {
	client.on(event, () => console.log(`You have been ${event}ed at ${new Date()}`));
}

client.database = new Database();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
	if (err) console.error(err);
	log(`Loading a total of ${files.length} commands.`);
	files.forEach(f => {
		const props = require(`./commands/${f}`);
		log(`Loading Command: ${props.help.name}. 👌`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});

client.reload = command => {
	Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./commands/${command}`)];
			const cmdFile = require(`./commands/${command}`);
			client.commands.delete(command);
			client.aliases.forEach((cmd, alias) => {
				if (cmd === command) client.aliases.delete(alias);
			});
			client.commands.set(command, cmdFile);
			cmdFile.conf.aliases.forEach(alias => {
				client.aliases.set(alias, cmdFile.help.name);
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

client.elevation = message => {
	/* This function should resolve to an ELEVATION level which
		 is then sent to the command handler for verification*/
	let permlvl = 0;
	if (settings.p1mod.includes(message.author.id) === true) permlvl = 2;
	if (settings.p1dev.includes(message.author.id) === true) permlvl = 3;
	if (settings.ownerid.includes(message.author.id) === true) permlvl = 4;
	return permlvl;
};


client.login(settings.token);
