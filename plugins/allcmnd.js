const config = require('../config');
const { getBuffer } = require('../lib/functions');

module.exports = async (conn, m, { from, body, pushName, isGroup, isAdmin, isBotAdmin }) => {
    const prefix = config.PREFIX;
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(" ");
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';

    if (!cmd) return;

    switch (cmd) {
        // --- BASIC COMMANDS ---
        case 'menu': case 'help':
            let menu = `✨ *TIMNASA NEXT FUTURE TMD* ✨\n\n`;
            menu += `👋 Habari *${pushName}*\n📍 Prefix: *${prefix}*\n\n`;
            menu += `🛡️ *ADMIN:* .kick, .add, .promote, .demote, .group (open/close), .hidetag\n`;
            menu += `📥 *DOWNLOAD:* .ytmp3, .ytmp4, .tiktok, .fb, .ig\n`;
            menu += `🛠️ *TOOLS:* .sticker, .ping, .runtime, .quoted, .owner, .alive, .tr (lang)\n`;
            menu += `🔍 *SEARCH:* .google, .lyrics\n\n🚀 *Powered by TIMNASA 2025*`;
            await conn.sendMessage(from, { text: menu }, { quoted: m });
            break;

        case 'ping':
            const start = Date.now();
            await conn.sendMessage(from, { text: 'Testing Speed...' }, { quoted: m });
            const end = Date.now();
            await conn.sendMessage(from, { text: `🚀 Speed: *${end - start}ms*` }, { quoted: m });
            break;

        case 'runtime':
            const uptime = process.uptime();
            const h = Math.floor(uptime / 3600);
            const min = Math.floor((uptime % 3600) / 60);
            const s = Math.floor(uptime % 60);
            await conn.sendMessage(from, { text: `⌚ Runtime: *${h}h ${min}m ${s}s*` }, { quoted: m });
            break;

        case 'alive':
            await conn.sendMessage(from, { text: "I am Alive and Active! 🤖✨" }, { quoted: m });
            break;

        case 'owner':
            await conn.sendContact(from, [config.OWNER_NUMBER], m);
            break;

        // --- GROUP ADMIN COMMANDS ---
        case 'kick':
            if (!isGroup) return m.reply("Kwenye Group tu!");
            if (!isAdmin) return m.reply("Wewe sio Admin!");
            let user = m.message.extendedTextMessage?.contextInfo?.participant || args[0] + '@s.whatsapp.net';
            await conn.groupParticipantsUpdate(from, [user], "remove");
            break;

        case 'add':
            if (!isGroup || !isAdmin) return;
            await conn.groupParticipantsUpdate(from, [args[0] + '@s.whatsapp.net'], "add");
            break;

        case 'promote':
            if (!isGroup || !isAdmin) return;
            let pUser = m.message.extendedTextMessage?.contextInfo?.participant;
            await conn.groupParticipantsUpdate(from, [pUser], "promote");
            break;

        case 'demote':
            if (!isGroup || !isAdmin) return;
            let dUser = m.message.extendedTextMessage?.contextInfo?.participant;
            await conn.groupParticipantsUpdate(from, [dUser], "demote");
            break;

        case 'hidetag':
            if (!isGroup || !isAdmin) return;
            const groupMetadata = await conn.groupMetadata(from);
            const participants = groupMetadata.participants.map(v => v.id);
            conn.sendMessage(from, { text: text ? text : "Habari Wanagroup!", mentions: participants });
            break;

        case 'group':
            if (!isGroup || !isAdmin) return;
            if (args[0] === 'open') {
                await conn.groupSettingUpdate(from, 'not_announcement');
                m.reply("Group Limefunguliwa!");
            } else if (args[0] === 'close') {
                await conn.groupSettingUpdate(from, 'announcement');
                m.reply("Group Limefungwa (Admins Only)!");
            }
            break;

        // --- DOWNLOADER COMMANDS (Mifano ya Logic) ---
        case 'ytmp4': case 'ytmp3':
            if (!text) return m.reply("Weka Link ya YouTube!");
            m.reply("Inapakua... Tafadhali subiri.");
            // Hapa utaitia scrapers zako za lib
            break;

        case 'tiktok':
            if (!text) return m.reply("Weka Link ya TikTok!");
            m.reply("Inatafuta video...");
            break;

        case 'fb': case 'ig':
            m.reply("Kazi hii inakuja hivi punde!");
            break;

        // --- SEARCH & TOOLS ---
        case 'sticker': case 's':
            m.reply("Reply picha au video fupi ukitumia .sticker");
            break;

        case 'google':
            if (!text) return m.reply("Unatafuta nini?");
            await conn.sendMessage(from, { text: `🔍 Google Search: https://www.google.com/search?q=${encodeURIComponent(text)}` });
            break;

        case 'lyrics':
            if (!text) return m.reply("Weka jina la wimbo!");
            m.reply(`Inatafuta maneno ya wimbo: ${text}...`);
            break;

        case 'quoted':
            if (!m.message.extendedTextMessage) return m.reply("Reply message uone uchawi!");
            console.log(m.message.extendedTextMessage.contextInfo.quotedMessage);
            m.reply("Data ya meseji imechapishwa kwenye console.");
            break;

        case 'tr': // Translate
            if (!text) return m.reply("Weka neno la kutafsiri!");
            m.reply("Translating...");
            break;

        case 'delete': case 'del':
            if (!m.message.extendedTextMessage) return;
            const key = {
                remoteJid: from,
                fromMe: false,
                id: m.message.extendedTextMessage.contextInfo.stanzaId,
                participant: m.message.extendedTextMessage.contextInfo.participant
            };
            await conn.sendMessage(from, { delete: key });
            break;

        default:
            // Kama command haipo
            break;
    }
};
