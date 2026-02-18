let express = require('express')
const maps = express.Router()

maps.post('/lat-lng', async (req, res) => {

    let api_key_geo = process.env.GEO_API;

    let address = req.body.address;

    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${api_key_geo}`).then((response) => response.json()).then(data => {

        if (data['results'].length == 0) return res.status(400).json({ message: "Invalid address" })

        let output = data['results'][0]['geometry'];
        return res.status(200).send(output)

    }).catch((err) => {

        console.log(err)
        return res.status(400).json({ message: "Invalid address" })
    })

})

async function getLatLng(address_name) {

    let api_key_geo = process.env.GEO_API;

    try {

        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address_name}&key=${api_key_geo}`)
        const data = await response.json();

        if (data.results.length == 0) {

            return { lat: 0, lng: 0 }
        } else {

            return data['results'][0]['geometry'];

        }

    } catch (err) {

        console.log(err)
    }

}

module.exports = { maps, getLatLng }