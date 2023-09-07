require('dotenv').config();

const { Client } = require('discord.js');
const isInvitation = require('is-discord-invite');
const client = new Client({ intents: [1, 512, 32768] });


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async msg => {
	if (msg.author.bot || msg.channel.type === 'dm') return; // Ignore messages from bots and private messages (user => bot).
	if (msg.content.length <= 10) return; // Ignore messages that have less than 10 characters.

	const result = await isInvitation.online(msg.content); // Validate the received message using api.sefinek.net.

	if (result.isInvitation) {
		await msg.delete();
		msg.channel.send(`
		${msg.author}, you cannot send any invitations on this server!
		
		- **Guild name:** ${result.discordResponse.guild.name}
		- **Guild ID:** ${result.discordResponse.guild.id}
		- **Inviter:** ${result.discordResponse.inviter.username} (${result.discordResponse.inviter.global_name})
		- **Inviter ID:** ${result.discordResponse.inviter.id}`,
		);

		console.log('Message is an invitation:', result.discordResponse);
	} else {
		console.log('Message is not an invitation');
	}
});


client.login(process.env.TOKEN);