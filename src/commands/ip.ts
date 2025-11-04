import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { config } from '../config';

export const data = new SlashCommandBuilder()
  .setName('ip')
  .setDescription('Affiche l\'adresse IP du serveur Minecraft');

export async function execute(interaction: CommandInteraction) {
  const serverInfo = `🎮 **Serveur Minecraft**\n` +
                    `📍 **IP:** \`${config.minecraft.serverIp}\`\n` +
                    `🔢 **Port:** \`${config.minecraft.serverPort}\`\n\n` +
                    `Connecte-toi avec cette adresse !`;

  await interaction.reply({
    content: serverInfo,
    ephemeral: false
  });
}