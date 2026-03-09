const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require('fs');
const config = require('./config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ["Timnasa TMD", "Safari", "3.0"]
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ TIMNASA TMD IMECONNECT TAYARI!');
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message || m.key.fromMe) return;
            
            const from = m.key.remoteJid;
            const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
            const isCmd = body.startsWith(config.PREFIX);
            const command = isCmd ? body.slice(config.PREFIX.length).trim().split(' ')[0].toLowerCase() : "";

            // Auto Status Read
            if (config.AUTO_READ_STATUS === "true" && from === 'status@broadcast') {
                await conn.readMessages([m.key]);
            }

            // Command Handler (Simple)
            if (isCmd) {
                if (command === 'menu') {
                    await conn.sendMessage(from, { text: `*TIMNASA TMD MENU*\n\n1. .sticker\n2. .ping\n3. .alive` }, { quoted: m });
                }
                if (command === 'ping') {
                    await conn.sendMessage(from, { text: "Pong! 🚀 Bot is Active." }, { quoted: m });
                }
            }
        } catch (err) {
            console.log("Error: ", err);
        }
    });
}

startBot();

