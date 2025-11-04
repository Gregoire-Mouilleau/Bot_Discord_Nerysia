import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Charger les variables d'environnement AVANT d'importer config
dotenv.config();

import { config } from './config';

const commands = [];

// Charger toutes les commandes depuis le dossier commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ Commande préparée: ${command.data.name}`);
  } else {
    console.log(`⚠️ La commande ${filePath} n'a pas les propriétés "data" et "execute" requises.`);
  }
}

// Construire et préparer une instance du module REST
const rest = new REST().setToken(config.discord.token);

// Déployer les commandes
(async () => {
  try {
    console.log(`🔄 Début du déploiement de ${commands.length} commande(s) slash.`);

    // La méthode put est utilisée pour rafraîchir complètement toutes les commandes dans la guilde avec le set actuel
    const data = await rest.put(
      Routes.applicationCommands(config.discord.clientId),
      { body: commands },
    ) as any[];

    console.log(`✅ ${data.length} commande(s) slash déployée(s) avec succès.`);
  } catch (error) {
    console.error('❌ Erreur lors du déploiement des commandes:', error);
  }
})();