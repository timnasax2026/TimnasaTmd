const os = require('os');
const config = require('../config');

module.exports = async (conn, msg, m) => {
    const { from, pushName, body } = m;
    const prefix = config.PREFIX;
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';

    if (cmd === 'menu' || cmd === 'help') {
        const runtime = process.uptime();
        const hrs = Math.floor(runtime / 3600);
        const mins = Math.floor((runtime % 3600) / 60);
        const secs = Math.floor(runtime % 60);

        let menuText = `
*╭━━〔 TIMNASA NEXT FUTURE 〕━━╮*
┃ 🤖 *BOT:* ${config.BOT_NAME}
┃ 👤 *USER:* ${pushName}
┃ ⏳ *UPTIME:* ${hrs}h ${mins}m ${secs}s
┃ 📂 *PLATFORM:* ${os.platform()}
┃ 📍 *PREFIX:* [ ${prefix} ]
╰━━━━━━━━━━━━━━━━━━━━╯

*┌───〔 COMMAND LIST 〕───*
│ 🛠️ ${prefix}ping
│ 📥 ${prefix}download (url)
│ 🖼️ ${prefix}sticker
│ 👥 ${prefix}groupinfo
│ ⚙️ ${prefix}settings
└─────────────────────

*🚀 Powered by TIMNASA TMD 20250*
`;
        
        // Kutuma menu ikiwa na picha (Optional)
        await conn.sendMessage(from, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA NEXT FUTURE TMD",
                    body: "The Future of WhatsApp Automation",
                    mediaType: 1,
                    sourceUrl: "https://github.com/TIMNASA",
                    thumbnailUrl: "https://i.imgur.com/your-image-link.jpg" // Weka link ya picha yako hapa
                }
            }
        }, { quoted: msg });
    }
};
