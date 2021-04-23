import mongoose from 'mongoose'

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

export default mongoose.models.Stat || mongoose.model('Stat', StatSchema)
