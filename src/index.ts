import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Charger les variables d'environnement AVANT d'importer config
dotenv.config();

import { config } from './config';

// Étendre le type Client pour inclure commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
  }
}

// Créer une nouvelle instance client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Créer une collection pour les commandes
client.commands = new Collection();

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Commande chargée: ${command.data.name}`);
  } else {
    console.log(`⚠️ La commande ${filePath} n'a pas les propriétés "data" et "execute" requises.`);
  }
}

// Event listener pour quand le client est prêt
client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot connecté en tant que ${readyClient.user.tag}`);
});

// Event listener pour les interactions (commandes slash)
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Aucune commande correspondante trouvée pour ${interaction.commandName}.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de ${interaction.commandName}:`);
    console.error(error);
    
    const errorMessage = { content: 'Une erreur s\'est produite lors de l\'exécution de cette commande !', ephemeral: true };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Se connecter à Discord
if (!config.discord.token) {
  console.error('❌ Token Discord manquant ! Vérifiez votre fichier .env');
  process.exit(1);
}

// Déployer les commandes puis se connecter
async function startBot() {
  try {
    // Déployer les commandes automatiquement
    const { deployCommands } = await import('./deploy');
    await deployCommands();
    
    // Se connecter
    await client.login(config.discord.token);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

startBot();