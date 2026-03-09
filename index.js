const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    makeInMemoryStore 
} = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const config = require('./config');

// Hifadhi ya muda kuzuia bot kuwa nzito
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

async function startTimnasa() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const conn = makeWASocket({
        logger: P({ level: "silent" }),
        auth: state,
        printQRInTerminal: true,
        browser: ["Timnasa TMD", "Chrome", "1.0.0"]
    });

    store.bind(conn.ev);

    // Kazi ya kuunganisha upya ikikata
    conn.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
            console.log("✅ TIMNASA TMD CONNECTED!");
            conn.sendMessage(conn.user.id, { text: "_Bot is Online! Base 20250 Ready._" });
        } else if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startTimnasa();
        }
    });

    conn.ev.on("creds.update", saveCreds);

    // --- SMART COMMAND HANDLER ---
    conn.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message || m.key.fromMe) return;

            const from = m.key.remoteJid;
            const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
            const isCmd = body.startsWith(config.PREFIX);
            const command = isCmd ? body.slice(config.PREFIX.length).trim().split(' ')[0].toLowerCase() : "";
            const args = body.trim().split(/ +/).slice(1);

            // Auto-Read Status (Kama umeweka kwenye config)
            if (config.AUTO_READ_STATUS === "true" && from === 'status@broadcast') {
                await conn.readMessages([m.key]);
            }

            // Logic ya kusoma faili la allcmds.js kiotomatiki
            if (isCmd) {
                const pluginPath = path.join(__dirname, 'plugins', 'allcmds.js');
                if (fs.existsSync(pluginPath)) {
                    const plugin = require(pluginPath);
                    // Tunatuma data muhimu tu kwa plugin ili kuokoa RAM
                    await plugin(conn, m, { 
                        from, 
                        body, 
                        args, 
                        command, 
                        pushName: m.pushName 
                    });
                }
            }
        } catch (err) {
            console.error("Error in Message Handler:", err);
        }
    });
}

// Anzisha Bot
startTimnasa();
