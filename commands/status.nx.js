/** type: slash-command
 * command: status
 * description: Get the status of the bot. Shows current version (latest from package.json), uptime, and memory usage.
 * usage: /status
 */

const { SlashCommandBuilder } = require('discord.js');
const { version } = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get the status of the bot, including version, uptime, and memory usage.'),
	async execute(interaction) {
		await interaction.reply(`Version: ${version}\nUptime: ${process.uptime()}\nMemory Usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
	},
};