const axios = require('axios')
const fetch = require('node-fetch')
const fs = require('fs')

// Function ya kupata Buffer (kudownload picha/video kwa muda)
const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Requests': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

// Function ya kubadilisha ukubwa wa file
const getSizeMedia = (numbers) => {
	if (!numbers) return '0 B'
	const UNIT_AMNT = [1024, 1024 * 1024, 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024]
	const UNIT_TYPES = ['B', 'KB', 'MB', 'GB', 'TB']
	for (let i = 0; i < UNIT_AMNT.length; i++) {
		if (numbers < UNIT_AMNT[i]) {
			return `${(numbers / (UNIT_AMNT[i - 1] || 1)).toFixed(2)} ${UNIT_TYPES[i]}`
		}
	}
	return '0 B'
}

module.exports = { getBuffer, getSizeMedia }

