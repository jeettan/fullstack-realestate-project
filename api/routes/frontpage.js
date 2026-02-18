let express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2;

router.get('/featured', async (req, res) => {

    try {
        await cloudinary.api.resources_by_asset_folder('RealEstateMarketplace/featured_images', {
            type: 'upload',
            max_results: 100,
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary fetch error:", error);
            } else {

                const imageUrls = result.resources.map(resource => resource.secure_url);
                return res.json(imageUrls);
            }
        });

    } catch (err) {

        return res.status(500).send("Cloudinary API error")
    }

})

router.get('/recommended_properties', async (req, res) => {

    try {
        await cloudinary.api.resources_by_asset_folder('RealEstateMarketplace/recommended_properties', {
            type: 'upload',
            max_results: 100,
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary fetch error:", error);
            } else {

                const imageUrls = result.resources.map(resource => resource.secure_url);
                return res.json(imageUrls);
            }
        });

    } catch (err) {
        return res.status(500).send("Cloudinary API error")
    }

})

module.exports = router;