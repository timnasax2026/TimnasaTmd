const axios = require('axios')

async function tiktok(url) {
    try {
        // Hapa unaweka API ya kudownload tiktok (Mfano: Tikwm au Lolis)
        const res = await axios.get(`https://api.tikwm.com/api/?url=${url}`)
        return res.data.data
    } catch (e) {
        return { error: "Imeshindikana kupata video." }
    }
}

module.exports = { tiktok }
