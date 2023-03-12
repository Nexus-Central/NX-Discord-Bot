/** type: utils
 * name: mod-panel
 * description: NX Moderation Panel
 * features: The moderation panel is a panel that allows you to moderate your server with ease. It can display banned users, kicked users, warned users and their
 * number of warns. It also allows you to ban, unban, kick, warn or unwarn users. It also allows you to execute commands on the server without having to type them in the chat.
 * usage: /mod-panel
 * additional notes: The moderation panel is a web panel that allows you to moderate your server with ease. It can display banned users, kicked users, warned users and their
 * number of warns. It also allows you to ban, unban, kick, warn or unwarn users. It also allows you to execute commands on the server without having to type them in the chat.
*/

// Data will be exported to the web panel using their API at https://api.nexuscentral.dev/v1/nxmp/

const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mod-panel')
		.setDescription('NX Moderation Panel'),
	async execute(interaction) {
		// Visit the panel button
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Visit Panel')
					.setStyle(ButtonStyle.Link)
					.setURL('https://nxmp.nexuscentral.dev'),
			);

		// Redirects to the web panel
		const embed = {
			'title': 'NX Moderation Panel',
			'description': 'The moderation panel is a panel that allows you to moderate your server with ease. It can display banned users, kicked users, warned users and their number of warns. It also allows you to ban, unban, kick, warn or unwarn users. It also allows you to execute commands on the server without having to type them in the chat.',
			'url': 'https://nxmp.nexuscentral.dev',
			'color': 0x00ff00,
			'footer': {
				'text': 'NX Moderation Panel',
			},
		};
		await interaction.reply({ embeds: [embed] });
		await interaction.followUp({ content: 'Visit the panel below:', components: [row] });
	},
};