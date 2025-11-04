"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Charger les variables d'environnement AVANT d'importer config
// En production (Railway), utilise .env.production, sinon .env
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });
const config_1 = require("./config");
// Créer une nouvelle instance client
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
// Créer une collection pour les commandes
client.commands = new discord_js_1.Collection();
// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Commande chargée: ${command.data.name}`);
    }
    else {
        console.log(`⚠️ La commande ${filePath} n'a pas les propriétés "data" et "execute" requises.`);
    }
}
// Event listener pour quand le client est prêt
client.once(discord_js_1.Events.ClientReady, (readyClient) => {
    console.log(`✅ Bot connecté en tant que ${readyClient.user.tag}`);
});
// Event listener pour les interactions (commandes slash)
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`❌ Aucune commande correspondante trouvée pour ${interaction.commandName}.`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(`❌ Erreur lors de l'exécution de ${interaction.commandName}:`);
        console.error(error);
        const errorMessage = { content: 'Une erreur s\'est produite lors de l\'exécution de cette commande !', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        }
        else {
            await interaction.reply(errorMessage);
        }
    }
});
// Se connecter à Discord
if (!config_1.config.discord.token) {
    console.error('❌ Token Discord manquant ! Vérifiez votre fichier .env');
    process.exit(1);
}
// Déployer les commandes puis se connecter
async function startBot() {
    try {
        // Déployer les commandes automatiquement
        const { deployCommands } = await Promise.resolve().then(() => __importStar(require('./deploy')));
        await deployCommands();
        // Se connecter
        await client.login(config_1.config.discord.token);
    }
    catch (error) {
        console.error('❌ Erreur lors du démarrage du bot:', error);
        process.exit(1);
    }
}
startBot();
//# sourceMappingURL=index.js.map