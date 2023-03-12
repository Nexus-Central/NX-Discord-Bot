/** type: slash-commands
 * category: moderation
 * description: a list of moderation commands
*/

const { SlashCommandBuilder } = require('discord.js');

/** type: slash-command
 * name: ban
 * description: bans a user
 * usage: /ban <user> [reason] <optional: delete-messages> <optional: number of days to delete messages>
 * example: /ban @user spamming <optional: true> <optional: 7>
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user')
		.addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The reason for the ban'))
		.addBooleanOption(option => option.setName('delete-messages').setDescription('Whether to delete messages from the user'))
		.addIntegerOption(option => option.setName('days').setDescription('The number of days to delete messages from the user')),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason');
		const deleteMessages = interaction.options.getBoolean('delete-messages');
		const days = interaction.options.getInteger('days');

		// Check if user is specified
		if (!user) return interaction.reply({ content: 'Please specify a user to ban!', ephemeral: true });

		// Check if user exists
		if (!interaction.guild.members.cache.get(user.id)) return interaction.reply({ content: 'That user does not exist!', ephemeral: true });

		// Bans user
		interaction.guild.members.ban(user.id, { reason: reason, days: deleteMessages ? days : 0 });
		interaction.reply({ content: `Banned ${user.tag}`, ephemeral: true });
		console.log(`[MOD::BAN] ${interaction.user.tag} banned ${user.tag} [${interaction.guild.name}]`);
	},
};