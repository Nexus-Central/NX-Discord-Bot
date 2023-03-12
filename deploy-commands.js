const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

// Dot env
dotenv.config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [];
// Grab all the command files from the commands directory and the utils directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.nx.js'));
const utilsPath = path.join(__dirname, 'utils');
const utilsFiles = fs.readdirSync(utilsPath).filter(file => file.endsWith('.nx.js'));

// Grab the SlashCommandBuilder#toJSON5() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Grab the SlashCommandBuilder#toJSON5() output of each util's data for deployment
for (const file of utilsFiles) {
	const command = require(`./utils/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN);

// deploy the commands
(async () => {
	try {
		console.log(`[INFO] Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		// Commands are guild specific by default, but can be made global by removing the GUILD_ID parameter
		// of the Routes.applicationGuildCommands() method
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`[INFO] Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		// If there is an error, log it
		console.error(`[ERROR] Failed to reload application (/) commands: ${error}`);
	}
})();