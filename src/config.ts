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