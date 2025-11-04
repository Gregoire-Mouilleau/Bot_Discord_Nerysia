"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('ip')
    .setDescription('Affiche l\'adresse IP du serveur Minecraft');
async function execute(interaction) {
    const serverInfo = `🎮 **Serveur Minecraft**\n` +
        `📍 **IP:** \`${config_1.config.minecraft.serverIp}\`\n` +
        `🔢 **Port:** \`${config_1.config.minecraft.serverPort}\`\n\n` +
        `Connecte-toi avec cette adresse !`;
    await interaction.reply({
        content: serverInfo,
        ephemeral: false
    });
}
//# sourceMappingURL=ip.js.map