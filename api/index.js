let express = require('express')
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser');

require("dotenv").config();

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

let frontpage = require('./routes/frontpage.js')
let properties = require('./routes/properties.js')
let users = require('./routes/users.js')
let { maps } = require('./routes/maps.js')

app.use('/api/frontpage', frontpage)
app.use('/api/users', users)
app.use('/api/properties', properties)
app.use('/api/maps', maps)

if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT, () => {
        console.log(`Express started on port ${process.env.PORT}`);
    });
}

module.exports = app;