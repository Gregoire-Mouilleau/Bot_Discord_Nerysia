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
dotenv.config();
const config_1 = require("./config");
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
    }
    else {
        console.log(`⚠️ La commande ${filePath} n'a pas les propriétés "data" et "execute" requises.`);
    }
}
// Construire et préparer une instance du module REST
const rest = new discord_js_1.REST().setToken(config_1.config.discord.token);
// Déployer les commandes
(async () => {
    try {
        console.log(`🔄 Début du déploiement de ${commands.length} commande(s) slash.`);
        // La méthode put est utilisée pour rafraîchir complètement toutes les commandes dans la guilde avec le set actuel
        const data = await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.discord.clientId), { body: commands });
        console.log(`✅ ${data.length} commande(s) slash déployée(s) avec succès.`);
    }
    catch (error) {
        console.error('❌ Erreur lors du déploiement des commandes:', error);
    }
})();
//# sourceMappingURL=deploy-commands.js.map