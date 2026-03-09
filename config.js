const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "TIMNASA~WEKA_SESSION_HAPA",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "255xxxxxxxxx",
    PREFIX: process.env.PREFIX || ".",
    MODE: process.env.MODE || "public",
    BOT_NAME: "TIMNASA NEXT FUTURE TMD",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};

