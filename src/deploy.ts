import { REST, Routes } from 'discord.js';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';

// En local seulement, charger le .env
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    console.log('dotenv non disponible, utilisation des variables d\'environnement directes');
  }
}

const commands: any[] = [];

// Charger toutes les commandes depuis le dossier commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ Commande préparée: ${command.data.name}`);
  }
}

// Fonction pour déployer les commandes
export async function deployCommands() {
  if (!config.discord.token || !config.discord.clientId) {
    console.error('❌ Token Discord ou Client ID manquant !');
    return false;
  }

  const rest = new REST().setToken(config.discord.token);

  try {
    console.log(`🔄 Début du déploiement de ${commands.length} commande(s) slash.`);

    const data = await rest.put(
      Routes.applicationCommands(config.discord.clientId),
      { body: commands },
    ) as any[];

    console.log(`✅ ${data.length} commande(s) slash déployée(s) avec succès.`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du déploiement des commandes:', error);
    return false;
  }
}