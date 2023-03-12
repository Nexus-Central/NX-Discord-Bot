const { SlashCommandBuilder } = require('discord.js');

/** type: slash-command
 * name: warning
 * description: Warn a user
 * usage: /warning <user> <reason>
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('warning')
		.setDescription('Warn a user')
		.addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The reason for the warning').setRequired(true)),
	async execute(interaction) {
		// Give the user the 'Warning' role
		await interaction.guild.members.cache.get(interaction.options.getUser('user').id).roles.add('1084432264798150726');

		// Send a message to the user
		await interaction.guild.members.cache.get(interaction.options.getUser('user').id).send(`You have been warned in ${interaction.guild.name} for ${interaction.options.getString('reason')}`);

		// Send a message to the channel
		await interaction.reply(`Warned ${interaction.options.getUser('user').tag} for ${interaction.options.getString('reason')}`);

		// Log the warning
		console.log(`[MOD::WARN] ${interaction.user.tag} warned ${interaction.options.getUser('user').tag} for ${interaction.options.getString('reason')}`);
	},
};