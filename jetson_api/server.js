const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const { v2 } = require('cloudinary')
const download = require('image-downloader')
const path = require("path")
const fs = require('fs')

dotenv.config()

const userController = require('./controllers/userController')

const User = require('./models/User')
const Image = require('./models/Image')

v2.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
});

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

const db = mongoose.connection

db.on('error', (err) => console.error(`Connection error: ${err}`))

db.once('open', () => {
    console.log('Db was connected')

    // db.createCollection('images', (err) => console.log(err))

    // db.createCollection('users', (err) => console.log(err))

    // db.createCollection('stats', (err) => console.log(err))
    // db.listCollections().toArray(function (err, collectionNames) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log(collectionNames);
    //     conn.close();
    // });
})

const app = express()

const port = 8080

app.use(express.text())

app.post('/', userController)

const publicPath = path.normalize(`${__dirname}/../jetson_recognized/`)

User.watch().on('change', (change) => {
    const { operationType, fullDocument } = change

    console.log(change)
    if (fullDocument) {
        console.log('User was created')
        fullDocument.images.map(async (item) => {
            const image = await Image.findOneAndUpdate({ _id: item }, { user: fullDocument._id }, { new: true })

            if (image.croped) {
                const options = {
                    url: image.url,
                    dest: publicPath
                }
                const { filename } = await download.image(options)
                console.log('Saved to', filename)
            }
        })
    }
})

Image.watch().on('change', async (change) => {
    const { operationType, documentKey } = change
    console.log('Image was created')
    if (operationType == 'delete') {

        const img = publicPath + documentKey._id + '.jpg'
        v2.uploader.destroy(documentKey._id, (result) => { console.log(result) })
        if (fs.existsSync(img)) {
            fs.unlinkSync(img, {
                force: true,
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Jetson restapi app listening at http://localhost:${port}`)
})