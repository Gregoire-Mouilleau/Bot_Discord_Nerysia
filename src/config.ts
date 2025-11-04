export interface Config {
  discord: {
    token: string;
    clientId: string;
  };
  minecraft: {
    serverIp: string;
    serverPort: number;
  };
}

// Configuration qui lit directement les variables d'environnement
export const config: Config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
  },
  minecraft: {
    serverIp: process.env.MINECRAFT_SERVER_IP || 'localhost',
    serverPort: parseInt(process.env.MINECRAFT_SERVER_PORT || '25565'),
  },
};

// Debug pour Railway
console.log('🔍 Config Debug:');
console.log('- DISCORD_TOKEN présent:', !!process.env.DISCORD_TOKEN);
console.log('- CLIENT_ID présent:', !!process.env.CLIENT_ID);
console.log('- Variables env disponibles:', Object.keys(process.env).filter(key => key.includes('DISCORD') || key.includes('CLIENT')));