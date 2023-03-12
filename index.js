// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
// formatUptime and formatMemoryUsage are exported from utils\stats.js
const { formatUptime, formatMemoryUsage } = require('./utils/stats.js');

// Dot env
dotenv.config();
const TOKEN = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command handler
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.nx.js'));
const utilsPath = path.join(__dirname, 'utils');
const utilsFiles = fs.readdirSync(utilsPath).filter(file => file.endsWith('.nx.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new line in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property".`);
	}
}

for (const file of utilsFiles) {
	const filePath = path.join(utilsPath, file);
	const command = require(filePath);
	// Set a new line in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property".`);
	}
}

// When the client is reayd, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in ${c.user.tag}`);
	updateBotStatus();
});

// When the client receives an interaction, run this code
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`[ERROR] The command ${interaction.commandName} does not exist.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Automatic Bot Status Report
const botStatusChannelId = '1083711618103378018';

// Defines a function to update the bot status message
const updateBotStatus = async () => {
	const botStatusChannel = client.channels.cache.get(botStatusChannelId);
	if (botStatusChannel) {
		const uptime = formatUptime(process.uptime());
		const memUsage = formatMemoryUsage(process.memoryUsage().rss);
		const statusMessage = {
			embeds: [{
				title: 'NEXUS CENTRAL - NX',
				description: 'Bot is online!',
				fields: [
					{
						name: 'Uptime',
						value: uptime,
						inline: true,
					},
					{
						name: 'Memory Usage',
						value: memUsage,
						inline: true,
					},
				],
				timestamp: new Date(),
			}],
		};
		botStatusChannel.messages.fetch({ limit: 1 }).then(messages => {
			const lastMessage = messages.first();
			if (lastMessage && lastMessage.author.id === client.user.id) {
				lastMessage.edit(statusMessage);
				// Debbuging purposes
				console.log('[DEBUG] Bot status message updated!');
			}
			else {
				botStatusChannel.send(statusMessage);
				// Debbuging purposes
				console.log('[DEBUG] Bot status message sent!');
			}
		});
	}
};

// Update the bot status message every 10 minutes
setInterval(updateBotStatus, 10 * 60 * 1000);

// Handle bot disconnects and update the bot status message
client.on('disconnect', () => {
	const botStatusChannel = client.channels.cache.get(botStatusChannelId);
	if (botStatusChannel) {
		botStatusChannel.messages.fetch({ limit: 1 }).then(messages => {
			const lastMessage = messages.first();
			if (lastMessage && lastMessage.author.id === client.user.id) {
				const statusMessage = {
					embeds: [{
						title: 'NEXUS CENTRAL - NX',
						description: 'Bot is offline!',
						timestamp: new Date(),
					}],
				};
				lastMessage.edit(statusMessage);
			}
		});
	}
});

// Handle bot reconnects and update the bot status message
client.on('reconnecting', () => {
	updateBotStatus();
});

// Login to Discord with your client's token
client.login(TOKEN);