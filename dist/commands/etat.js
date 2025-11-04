"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const minecraft_server_util_1 = require("minecraft-server-util");
const config_1 = require("../config");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('etat')
    .setDescription('Affiche l\'état du serveur Minecraft et le nombre de joueurs connectés');
async function execute(interaction) {
    await interaction.deferReply();
    try {
        const response = await (0, minecraft_server_util_1.status)(config_1.config.minecraft.serverIp, config_1.config.minecraft.serverPort);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🟢 Serveur Minecraft - En ligne')
            .setColor(0x00FF00)
            .addFields({ name: '📍 Adresse', value: `${config_1.config.minecraft.serverIp}:${config_1.config.minecraft.serverPort}`, inline: true }, { name: '👥 Joueurs', value: `${response.players.online}/${response.players.max}`, inline: true }, { name: '🎮 Version', value: response.version.name, inline: true }, { name: '📊 Ping', value: `${response.roundTripLatency}ms`, inline: true })
            .setTimestamp();
        if (response.players.sample && response.players.sample.length > 0) {
            const playerList = response.players.sample.map(player => player.name).join(', ');
            embed.addFields({ name: '🎯 Joueurs connectés', value: playerList, inline: false });
        }
        await interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🔴 Serveur Minecraft - Hors ligne')
            .setColor(0xFF0000)
            .setDescription('Le serveur Minecraft n\'est pas accessible actuellement.')
            .addFields({ name: '📍 Adresse', value: `${config_1.config.minecraft.serverIp}:${config_1.config.minecraft.serverPort}`, inline: true }, { name: '❌ Statut', value: 'Hors ligne', inline: true })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
}
//# sourceMappingURL=etat.js.map