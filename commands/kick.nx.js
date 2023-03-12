const { SlashCommandBuilder } = require('discord.js');

/** type: slash-command
 * name: kick
 * description: kicks a user
 * usage: /kick <user> [reason]
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user')
		.addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The reason for the kick')),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason');

		// Check if user is specified
		if (!user) return interaction.reply({ content: 'Please specify a user to kick!', ephemeral: true });

		// Check if user exists
		if (!interaction.guild.members.cache.get(user.id)) return interaction.reply({ content: 'That user does not exist!', ephemeral: true });

		// Kicks user (if reason is specified)
		if (reason) {
			interaction.guild.members.kick(user.id, { reason: reason });
			interaction.reply({ content: `Kicked ${user.tag} for ${reason}`, ephemeral: true });
			console.log(`[MOD::KICK] ${interaction.user.tag} kicked ${user.tag} for reason: ${reason} [${interaction.guild.name}`);
		}
		else {
			interaction.reply({ content: 'Please specify a reason for the kick!', ephemeral: true });
		}
	},
};