var express = require('express')
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const { PrismaClient } = require('@prisma/client')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer')
const fs = require('fs').promises
var uuid = require("uuid");
var path = require("path");
const { nanoid } = require('nanoid');
const { features } = require('process');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (file.fieldname === "fileBulk") {
            cb(null, 'temp/bulk/');
        } else {

            cb(null, 'temp/')

        }
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
})

var upload = multer({ storage: storage })


const prisma = new PrismaClient();

app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/get-featured', async (req, res) => {

    cloudinary.api.resources_by_asset_folder('featured_images', {
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

})

app.get('/recommended_properties', async (req, res) => {

    cloudinary.api.resources_by_asset_folder('recommended_properties', {
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

})

app.get('/grab-rental-properties', async (req, res) => {

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
            },

            property_type: {

                contains: type
            },

            date_listed: {

                gte: daysago
            }

        }, ...(order ? { orderBy: { price: order } } : {})
    });
    return res.json(props)
})

app.get('/grab-rental-images', async (req, res) => {

    const folder_id = req.query.id;

    if (folder_id) {

        cloudinary.api.resources_by_asset_folder(folder_id, {
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

const verifyToken = async function (req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send("Invalid token");
    }

}

app.post('/grab-rental-properties-with-property-id', async (req, res) => {

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

app.post('/grab-rental-properties-with-id', verifyToken, async (req, res) => {

    let id = req.user.id

    try {

        const props = await prisma.properties.findMany({

            where: {
                user_id: id,
                title: {
                    contains: req.body.query
                }
            }
        });

        return res.json(props);

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "No properties found for this user_id" });
    }

})

app.post('/register', async (req, res) => {

    const users = await prisma.users.findFirst({

        where: {
            username: req.body.username
        }
    });

    if (users) {

        return res.status(401).send({ message: "Error! Username already exists" })
    }

    if (req.body.password != req.body.passwordagain) {

        return res.status(401).send({ message: "Passwords do not match" })
    }

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(req.body.email)) {

        return res.status(401).send({ message: "Email not in the correct format" })
    }

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALTVALUE));
    const passwordSalted = bcrypt.hashSync(req.body.password, salt)

    await prisma.users.create({
        data: {
            username: req.body.username,
            password: passwordSalted,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        },
    });

    console.log("Successfully registered user")

    return res.status(200).send("Successfully registered")

})

app.post('/login', async (req, res) => {

    const userFind = await prisma.users.findUnique({

        where: {
            username: req.body.username
        }
    })

    if (userFind) {

        let comparePassword = bcrypt.compareSync(req.body.password, userFind.password);

        if (comparePassword) {

            const token = jwt.sign({ username: userFind.username, id: userFind.id, first_name: userFind.first_name, last_name: userFind.last_name, email: userFind.email }, process.env.JWT_SECRET, { expiresIn: process.env.expires });

            return res.status(200).send({ token: token })
        }

    } else {

        return res.status(401).send("Incorrect login details")
    }

    return res.status(401).send("Incorrect login details")

})


app.post('/verify-token', verifyToken, async (req, res) => {

    res.send({ message: `Hello ${req.user.first_name}, you are verified`, token: req.user })
});

app.post('/get-user-details', verifyToken, async (req, res) => {

    let id = parseInt(req.user.id)

    let users = await prisma.users.findUnique({

        where: {
            id: id
        },
        select: {
            id: true,
            email: true,
            username: true,
            first_name: true,
            last_name: true,
        }
    })

    return res.send(users)

})


app.post('/get-lat-long', async (req, res) => {

    let api_key_geo = process.env.GEO_API;

    let address = req.body.address;

    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${api_key_geo}`).then((response) => response.json()).then(data => {

        let output = data['results'][0]['geometry'];

        return res.status(200).send(output)

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

app.patch('/change-password', verifyToken, async (req, res) => {

    let userFound = await prisma.users.findUnique({

        where: {

            username: req.body.username,
        }
    })

    if (userFound) {

        let comparePassword = bcrypt.compareSync(req.body.password, userFound.password);

        if (comparePassword) {

            const salt = bcrypt.genSaltSync(parseInt(process.env.SALTVALUE));
            const passwordSalted = bcrypt.hashSync(req.body.newpwd, salt)

            let update = await prisma.users.update({

                where: {
                    username: req.body.username

                },

                data: {
                    password: passwordSalted
                }

            })

            return res.status(200).send("Password updated");
        } else {

            return res.status(400).send("Password is incorrect")
        }
    }

})

app.patch('/update-user-details', verifyToken, async (req, res) => {

    let id = req.user.id

    try {

        await prisma.users.update({

            where: {
                id: id
            },

            data: {

                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }
        })

    } catch (err) {

        console.log(err)
        return res.status(400)
    }

    return res.status(200).send("Success!")

})

app.post('/add-properties', verifyToken, upload.any(), async (req, res) => {

    try {

        let features = ""

        if (req.body.features != undefined) {

            if (req.body.features.length > 0) {

                if (!Array.isArray(req.body.features)) {

                    features = req.body.features
                } else {

                    features = req.body.features.join(',');

                }

            }
        }

        const fileSingle = req.files.find(f => f.fieldname === 'fileSingle');

        const pathOfSingleFile = fileSingle.path

        const latlng = await getLatLng(req.body.address);

        const newUser = await prisma.properties.create({
            data: {
                title: req.body.propName,
                user_id: req.user.id,
                description: req.body.description,
                price: parseInt(req.body.rent),
                address: req.body.address,
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
            }
        })

        let response = await cloudinary.uploader.upload(`${pathOfSingleFile}`, { folder: 'featured_hero' })

        const url = response.url

        let folder_id = nanoid(20)

        await prisma.properties.update({

            where: {

                id: newUser.id
            },
            data: {

                featured_image_url: url,
                folder_id: folder_id
            }
        })

        const deleteFile = path.join(__dirname, `${pathOfSingleFile}`);

        await fs.unlink(deleteFile);

        console.log("Single folder cleared")

        console.log("Uploading additional photos to Cloudinary..")

        const bulkFolderPath = path.join(__dirname, '/temp/bulk');

        const files = await fs.readdir(bulkFolderPath);

        const create_new_folder = await cloudinary.api.create_folder(`${folder_id}`);
        console.log(create_new_folder)

        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        });


        for (const image of imageFiles) {
            await cloudinary.uploader.upload(`temp/bulk/${image}`, {
                folder: folder_id
            });
        }

        console.log("Images uploaded to Cloudinary");

        for (const file of files) {
            await fs.unlink(path.join(bulkFolderPath, file));
        }
        console.log("Bulk folder cleared");

        console.log("Prop successfully added: ", newUser)

        return res.status(200).send({ message: "Props succesfully added" })

    } catch (err) {

        console.log(err)
        return res.status(500).send("Error uploading new properties");
    }

})

app.patch('/edit-property', verifyToken, upload.any(), async (req, res) => {

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

        if (prisAddress.address != req.body.address) {

            console.log("getting new address..")

            const latlng = await getLatLng(req.body.address);

            lat = latlng.lat
            lng = latlng.lng

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
                developer_name: req.body.dev_name,
                agent_name: req.body.agent_name,
                agent_contact: req.body.agent_contact,
                line_id: req.body.line_id,

            }
        })

        let join = req.body.carousel;

        await cloudinary.api.resources_by_asset_folder(prisAddress.folder_id, {
            type: 'upload',
            max_results: 100,
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary fetch error:", error);
            } else {

                const imageUrls = result.resources.map(resource => resource.secure_url);
                const notInArr2 = imageUrls.filter(item => !join.includes(item));

                console.log("Send these file for deletion", notInArr2)

                notInArr2.forEach((item) => {

                    const match = item.match(/([^/]+?)(?:\.(jpg|jpeg|png|webp))?$/i);

                    cloudinary.uploader.destroy(`${prisAddress.folder_id}/${match[1]}`).then(result => console.log(result))

                })

            }
        });

        if (req.files.length > 0) {

            const fileSingle = req.files.find(f => f.fieldname === 'fileSingle');
            const fileBulk = req.files.find(f => f.fieldname === 'fileBulk');

            if (fileSingle != undefined) {

                const pathOfSingleFile = fileSingle.path

                const match = prisAddress.featured_image_url.match(/([^/]+?)(?:\.(jpg|jpeg|png|webp))?$/i);

                await cloudinary.uploader.destroy(`featured_hero/${match[1]}`).then(result => console.log(result))

                let response = await cloudinary.uploader.upload(`${pathOfSingleFile}`, { folder: 'featured_hero' })

                const url = response.url;

                await prisma.properties.update({

                    where: {

                        id: parseInt(prop_id)
                    },
                    data: {

                        featured_image_url: url,
                    }
                })

                const deleteFile = path.join(__dirname, `${pathOfSingleFile}`);

                await fs.unlink(deleteFile);

            }

            if (fileBulk != undefined) {

                const bulkFolderPath = path.join(__dirname, '/temp/bulk');

                const files = await fs.readdir(bulkFolderPath);

                const imageFiles = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
                });

                for (const image of imageFiles) {
                    await cloudinary.uploader.upload(`temp/bulk/${image}`, {
                        folder: prisAddress.folder_id
                    });
                }
                console.log("Images uploaded to Cloudinary");

                for (const file of files) {
                    await fs.unlink(path.join(bulkFolderPath, file));
                }

            }

        }
        console.log("Property updated")
        return res.status(200).send("Property updated!");

    } catch (err) {
        console.log(err)
    }
})

app.delete('/delete-property', verifyToken, async (req, res) => {

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

        let k = await cloudinary.api.resources_by_asset_folder(prisAddress.folder_id, {
            type: 'upload',
            max_results: 100,
        })

        k.resources.forEach(async (res) => {
            await cloudinary.uploader.destroy(res.public_id);
        });

        await cloudinary.api.delete_folder(`${prisAddress.folder_id}`)

        const match = prisAddress.featured_image_url.match(/([^/]+?)(?:\.(jpg|jpeg|png|webp))?$/i);

        await cloudinary.uploader.destroy(`featured_hero/${match[1]}`).then(result => console.log(result))

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

app.listen(process.env.PORT, () => {

    console.log(`Express started on port ${process.env.PORT}`);

});