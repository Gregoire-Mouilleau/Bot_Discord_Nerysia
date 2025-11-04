import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { status } from 'minecraft-server-util';
import { config } from '../config';

export const data = new SlashCommandBuilder()
  .setName('etat')
  .setDescription('Affiche l\'état du serveur Minecraft et le nombre de joueurs connectés');

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  try {
    const response = await status(config.minecraft.serverIp, config.minecraft.serverPort);
    
    const embed = new EmbedBuilder()
      .setTitle('🟢 Serveur Minecraft - En ligne')
      .setColor(0x00FF00)
      .addFields(
        { name: '📍 Adresse', value: `${config.minecraft.serverIp}:${config.minecraft.serverPort}`, inline: true },
        { name: '👥 Joueurs', value: `${response.players.online}/${response.players.max}`, inline: true },
        { name: '🎮 Version', value: response.version.name, inline: true },
        { name: '📊 Ping', value: `${response.roundTripLatency}ms`, inline: true }
      )
      .setTimestamp();

    if (response.players.sample && response.players.sample.length > 0) {
      const playerList = response.players.sample.map(player => player.name).join(', ');
      embed.addFields({ name: '🎯 Joueurs connectés', value: playerList, inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    const embed = new EmbedBuilder()
      .setTitle('🔴 Serveur Minecraft - Hors ligne')
      .setColor(0xFF0000)
      .setDescription('Le serveur Minecraft n\'est pas accessible actuellement.')
      .addFields(
        { name: '📍 Adresse', value: `${config.minecraft.serverIp}:${config.minecraft.serverPort}`, inline: true },
        { name: '❌ Statut', value: 'Hors ligne', inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
}