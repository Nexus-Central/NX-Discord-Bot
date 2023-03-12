const { SlashCommandBuilder } = require('discord.js');

/** type: slash-command
 * name: unban
 * description: unbans a user
 * usage: /unban <user>
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a user')
		.addUserOption(option => option.setName('user').setDescription('The user to unban').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		// Check if user is specified
		if (!user) return interaction.reply({ content: 'Please specify a user to unban!', ephemeral: true });

		// Check if user exists
		if (!interaction.guild.members.cache.get(user.id)) return interaction.reply({ content: 'That user does not exist!', ephemeral: true });

		// Check if user is banned
		if (!interaction.guild.bans.cache.get(user.id)) return interaction.reply({ content: 'That user is not banned!', ephemeral: true });

		// Unbans user
		interaction.guild.members.unban(user.id);
		interaction.reply({ content: `Unbanned ${user.tag}`, ephemeral: true });
		console.log(`[MOD::UNBAN] ${interaction.user.tag} unbanned ${user.tag} [${interaction.guild.name}]`);
	},
};