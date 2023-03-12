const { SlashCommandBuilder } = require('discord.js');

/** type: slash-command
 * name: clear
 * description: clears messages
 * usage: /clear <optional: channelId> <optional: user> <amount>
 * example: /clear 10
 * example: /clear #general 10
 * example: /clear @user 10
 * example: /clear #general @user 10
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears messages')
		.addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to clear').setRequired(true))
		.addChannelOption(option => option.setName('channel').setDescription('The channel to clear messages from'))
		.addUserOption(option => option.setName('user').setDescription('The user to clear messages from')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');
		const channel = interaction.options.getChannel('channel');
		const user = interaction.options.getUser('user');

		// Check if amount is specified
		if (!amount) return interaction.reply({ content: 'Please specify an amount of messages to clear!', ephemeral: true });

		// Check if amount is valid
		if (amount < 1 || amount > 100) return interaction.reply({ content: 'Please specify an amount between 1 and 100!', ephemeral: true });

		// Check if channel is specified
		if (!channel) {
			// Clears messages
			interaction.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				interaction.reply({ content: 'There was an error trying to clear messages in this channel!', ephemeral: true });
			});
		}
		else {
			// Check if channel exists
			if (!interaction.guild.channels.cache.get(channel.id)) return interaction.reply({ content: 'That channel does not exist!', ephemeral: true });

			// Check if user is specified
			if (!user) {
				// Clears messages
				channel.bulkDelete(amount, true).catch(err => {
					console.error(err);
					interaction.reply({ content: 'There was an error trying to clear messages in that channel!', ephemeral: true });
				});
			}
			else {
				// Check if user exists
				if (!interaction.guild.members.cache.get(user.id)) return interaction.reply({ content: 'That user does not exist!', ephemeral: true });

				// Clears messages
				channel.bulkDelete(amount, true).catch(err => {
					console.error(err);
					interaction.reply({ content: 'There was an error trying to clear messages in that channel!', ephemeral: true });
				});
			}
		}

		if (user && channel) {
			interaction.reply({ content: `Cleared ${amount} messages from ${user.tag} in ${channel.name}`, ephemeral: true });
			console.log(`[MOD::CLEAR] ${interaction.user.tag} cleared ${amount} messages from ${user.tag} in ${channel.name} [${interaction.guild.name}]`);
		}
		else if (user) {
			interaction.reply({ content: `Cleared ${amount} messages from ${user.tag}`, ephemeral: true });
			console.log(`[MOD::CLEAR] ${interaction.user.tag} cleared ${amount} messages from ${user.tag} [${interaction.guild.name}]`);
		}
		else if (channel) {
			interaction.reply({ content: `Cleared ${amount} messages from ${channel.name}`, ephemeral: true });
			console.log(`[MOD::CLEAR] ${interaction.user.tag} cleared ${amount} messages from ${channel.name} [${interaction.guild.name}]`);
		}
		else {
			interaction.reply({ content: `Cleared ${amount} messages`, ephemeral: true });
			console.log(`[MOD::CLEAR] ${interaction.user.tag} cleared ${amount} messages [${interaction.guild.name}]`);
		}
	},
};