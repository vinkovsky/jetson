const mongoose = require("mongoose")

const StatSchema = new mongoose.Schema({
    name: String,
    images: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Stat', StatSchema)