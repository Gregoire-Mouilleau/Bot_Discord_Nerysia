"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    discord: {
        token: process.env.DISCORD_TOKEN || '',
        clientId: process.env.CLIENT_ID || '',
    },
    minecraft: {
        serverIp: process.env.MINECRAFT_SERVER_IP || 'localhost',
        serverPort: parseInt(process.env.MINECRAFT_SERVER_PORT || '25565'),
    },
};
//# sourceMappingURL=config.js.map