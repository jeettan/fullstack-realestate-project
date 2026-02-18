let express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
let { verifyToken } = require('../middleware/verifyToken.js')
let { getLatLng } = require('./maps.js')

const multer = require('multer')
const fs = require("fs").promises;
const fsStandard = require('fs');
const os = require('os');
let uuid = require("uuid");
let path = require("path");

let nanoid;

(async () => {
    const mod = await import('nanoid');
    nanoid = mod.nanoid;
})();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = os.tmpdir();
        const bulkDir = path.join(tempDir, 'bulk');

        if (file.fieldname === "fileBulk") {
            if (!fsStandard.existsSync(bulkDir)) {
                fsStandard.mkdirSync(bulkDir, { recursive: true });
            }
            cb(null, bulkDir);
        } else {
            cb(null, tempDir)
        }
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
})
var upload = multer({ storage: storage })

router.get('/rental-properties', async (req, res) => {

    let query = req.query.query || ''

    let type = req.query.type || ''

    let order = req.query.order || ''

    const today = new Date();
    const daysago = new Date();

    let daysAgo = 125 * 365;

    if (req.query.dayAgo != '') {

        daysAgo = req.query.dayAgo
    }

    daysago.setDate(today.getDate() - daysAgo);

    const props = await prisma.properties.findMany({

        where: {

            title: {
                contains: query,
                mode: 'insensitive',
            },

            property_type: {
                contains: type
            },

            date_listed: {
                gte: daysago
            },

        }, ...(order ? { orderBy: { price: order } } : { orderBy: { date_listed: 'desc' } })
    });

    return res.json(props)
})

router.get('/rental-images', async (req, res) => {

    const folder_id = req.query.id;

    if (folder_id) {

        cloudinary.api.resources_by_asset_folder(`RealEstateMarketplace/Rentals/${folder_id}`, {
            type: 'upload',
            max_results: 100,
        }, (error, result) => {
            if (error) {
                console.error("There are no extra images for this folder");
            } else {

                const imageUrls = result.resources.map(resource => resource.secure_url)
                return res.json(imageUrls);
            }
        }

        );

    } else {

        res.status(404).send("Folder for property id not found")
    }

})

router.post('/rental-properties-with-property-id', async (req, res) => {

    let id = req.body.id

    try {

        const props = await prisma.properties.findUnique({

            where: {
                id: parseInt(id)
            }
        });

        return res.json(props);

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "No properties found for this user_id" });
    }

})

router.post('/rental-properties-with-id', verifyToken, async (req, res) => {

    let id = req.user.id

    try {

        const props = await prisma.properties.findMany({

            where: {
                user_id: id,
                title: {
                    contains: req.body.query,
                    mode: "insensitive"
                }
            }
        });

        return res.json(props);

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "No properties found for this user_id" });
    }

})

router.post('/add-properties', verifyToken, upload.fields([
    { name: "featured_photo", maxCount: 1 },
    { name: "photos", maxCount: 6 }
]), async (req, res) => {

    try {

        let features = ""

        if (req.body.features != undefined && req.body.features.length > 0) {

            if (!Array.isArray(req.body.features)) {

                features = req.body.features
            } else {
                features = req.body.features.join(',');
            }
        }

        const fileSingle = req.files?.featured_photo?.[0];
        const pathOfSingleFile = fileSingle.path

        let address = req.body.address.trim()

        const latlng = await getLatLng(req.body.address);

        const propName = req.body.propName.replace(/[^a-z0-9-]/g, "");

        const sanitizeName = propName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")

        let folder_id = sanitizeName + "_" + nanoid(15)

        await cloudinary.api.create_folder(`RealEstateMarketplace/Rentals/${folder_id}`);
        let response = await cloudinary.uploader.upload(`${pathOfSingleFile}`, { folder: `RealEstateMarketplace/Rentals/${folder_id}/hero` })
        const featured_image_url = response.url

        fs.unlink(pathOfSingleFile);

        const newUser = await prisma.properties.create({
            data: {
                title: propName,
                user_id: req.user.id,
                description: req.body.description,
                price: parseInt(req.body.rent),
                address: address,
                property_type: req.body.typeOfHouse,
                features: features,
                bedrooms: parseInt(req.body.bedrooms),
                plot_size: parseInt(req.body.plot_size),
                parking_spots: parseInt(req.body.parking_spots),
                storeys: parseInt(req.body.storeys),
                date_listed: new Date(),
                completion_year: parseInt(req.body.year_completed),
                developer_name: req.body.dev_name,
                lat: latlng.lat,
                lng: latlng.lng,
                agent_name: req.body.agent_name,
                agent_contact: req.body.agent_number,
                line_id: req.body.agent_id,
                folder_id: folder_id,
                featured_image_url: featured_image_url
            }
        })


        console.log("Uploading additional photos to Cloudinary..")

        const galleryPhotos = req.files?.photos || [];

        for (const file of galleryPhotos) {

            const result = await cloudinary.uploader.upload(file.path, {
                folder: `RealEstateMarketplace/Rentals/${folder_id}`
            });

            fs.unlink(file.path);

        }

        console.log("Images uploaded to Cloudinary");

        console.log("Prop successfully added: ", newUser)

        return res.status(200).send({ message: "Props succesfully added" })

    } catch (err) {

        console.log(err)
        return res.status(500).send("Error uploading new properties");
    }

})

router.patch('/edit-property', verifyToken, upload.any(), async (req, res) => {

    const prop_id = req.body.id

    let features = ""

    try {

        let prisAddress = await prisma.properties.findUnique({


            where: {

                id: parseInt(prop_id)
            },

            select: {

                address: true,
                user_id: true,
                lat: true,
                lng: true,
                featured_image_url: true,
                folder_id: true
            }
        })


        if (prisAddress.user_id != req.user.id) {

            return res.status(500).send("You have no permission to edit this property");

        }

        if (req.body.features != undefined) {

            if (req.body.features.length > 0) {

                if (!Array.isArray(req.body.features)) {

                    features = req.body.features
                } else {

                    features = req.body.features.join(',');

                }

            }
        }

        let lat = prisAddress.lat
        let lng = prisAddress.lng

        if (!req.body.address || req.body.address.trim() === "") {
            return res.status(400).json({ message: "Address is required" })
        }

        if (prisAddress.address != req.body.address) {

            console.log("getting new address..")

            try {

                const latlng = await getLatLng(req.body.address);

                lat = latlng.lat
                lng = latlng.lng

            } catch (err) {

                lat = ""
                lng = ""
            }

        }

        await prisma.properties.update({

            where: {

                id: parseInt(prop_id)
            },

            data: {

                title: req.body.title,
                description: req.body.description,
                price: parseInt(req.body.price),
                address: req.body.address,
                property_type: req.body.property_type,
                bedrooms: parseInt(req.body.bedrooms),
                features: features,
                bedrooms: parseInt(req.body.bedrooms),
                lat: lat,
                lng: lng,
                plot_size: parseInt(req.body.plot_size),
                parking_spots: parseInt(req.body.parking_spots),
                storeys: parseInt(req.body.storeys),
                completion_year: parseInt(req.body.completion_year),
                developer_name: req.body.developer_name,
                agent_name: req.body.agent_name,
                agent_contact: req.body.agent_contact,
                line_id: req.body.line_id,

            }
        })

        //Break. Above are text based edits, below are picture based edits. Make a function to skip the picture based edits if there are none to be made.

        let join = req.body.carousel;

        await cloudinary.api.resources_by_asset_folder(`RealEstateMarketplace/Rentals/${prisAddress.folder_id}`, {
            type: 'upload',
            max_results: 100,
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary fetch error:", error);
            } else {
                const imageUrls = result.resources.map(resource => resource.secure_url);
                const notInArr2 = imageUrls.filter(item => !join.includes(item));

                console.log("Deleted resources:", notInArr2.length)

                if (notInArr2.length !== 0) {
                    notInArr2.forEach((item) => {
                        const match = item.match(/([^/]+?)(?:\.(jpg|jpeg|png|webp|avif))?$/i);
                        cloudinary.uploader.destroy(`RealEstateMarketplace/Rentals/${prisAddress.folder_id}/${match[1]}`)
                    })
                }
            }
        });

        if (req.files.length > 0) {

            const fileSingle = req.files.find(f => f.fieldname === 'fileSingle');
            const fileBulk = req.files.find(f => f.fieldname === 'fileBulk');

            if (fileSingle != undefined) {

                const pathOfSingleFile = fileSingle.path

                const result = await cloudinary.api.delete_resources_by_prefix(
                    `RealEstateMarketplace/Rentals/${prisAddress.folder_id}/hero`,
                    {
                        resource_type: "image",
                        type: "upload",
                        all: true
                    }
                );

                let response = await cloudinary.uploader.upload(`${pathOfSingleFile}`, { folder: `RealEstateMarketplace/Rentals/${prisAddress.folder_id}/hero` })

                const url = response.url;

                await prisma.properties.update({

                    where: {

                        id: parseInt(prop_id)
                    },
                    data: {
                        featured_image_url: url,
                    }
                })

                const deleteFile = pathOfSingleFile;

                fs.unlink(deleteFile);

            }

            if (fileBulk != undefined) {

                const bulkFolderPath = path.join(os.tmpdir(), 'bulk');

                const files = await fs.readdir(bulkFolderPath);

                const imageFiles = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
                });

                console.log("New images:", imageFiles.length)

                for (const image of imageFiles) {
                    await cloudinary.uploader.upload(path.join(bulkFolderPath, image), {
                        folder: `RealEstateMarketplace/Rentals/${prisAddress.folder_id}`
                    });
                }
                console.log("Images uploaded to Cloudinary");

                for (const file of files) {
                    fs.unlink(path.join(bulkFolderPath, file));
                }

            }

        }
        console.log("Property updated")
        return res.status(200).send("Property updated!");

    } catch (err) {
        console.log(err)
    }
})

router.delete('/delete-property', verifyToken, async (req, res) => {

    const prop_id = req.query.id

    let prisAddress = await prisma.properties.findUnique({

        where: {

            id: parseInt(prop_id)
        },

        select: {

            user_id: true,
            folder_id: true,
            featured_image_url: true

        }
    })

    if (prisAddress.user_id != req.user.id) {

        return res.status(500).send("You have no permission to edit this property");

    }

    try {

        let k = await cloudinary.api.resources_by_asset_folder(`RealEstateMarketplace/Rentals/${prisAddress.folder_id}`, {
            type: 'upload',
            max_results: 100,
        })

        k.resources.forEach(async (res) => {
            await cloudinary.uploader.destroy(res.public_id);
        });

        await cloudinary.api.delete_resources_by_prefix(
            `RealEstateMarketplace/Rentals/${prisAddress.folder_id}/hero`
        );

        await cloudinary.api.delete_folder(`RealEstateMarketplace/Rentals/${prisAddress.folder_id}`)

        const deletedUser = await prisma.properties.delete({
            where: {
                id: parseInt(prop_id),
            },
        });

        console.log('Deleted user:', deletedUser);

        return res.status(200).send("Property deleted")

    } catch (err) {

        console.log(err)
        return res.status(500).send("Error", err)
    }

})


module.exports = router;