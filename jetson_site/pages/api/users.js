import dbConnect from '../../utils/dbConnect'
import User from '../../models/User'
import Image from '../../models/Image'

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const users = await User.find({}).populate('images')
                res.status(200).json({ success: true, data: users })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {
                const user = await User.findOneAndUpdate({ name: req.body.name }, { "$addToSet": { "images": req.body.images } }, { new: true, upsert: true })
                req.body.images.map(async (id) => {
                    await Image.findByIdAndUpdate(id, { user: user._id })
                })
                res.status(201).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'PUT':
            try {
                const user = await User.findByIdAndUpdate(req.body.id, { name: req.body.name }, (err, doc) => console.log(doc))

                if (!user) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'DELETE':
            try {
                const { _id, imageId } = req.body

                if (!imageId) {
                    const deleteUser = await User.findByIdAndRemove({ _id }).populate('images')
                    if (!deleteUser) return res.status(400).json({ success: false })

                    deleteUser.images.map(async (image) => {
                        await Image.findByIdAndRemove(image._id)
                    })
                } else {
                    const deleteImage = await User.findByIdAndUpdate(_id, { "$pullAll": { "images": [imageId] } }).populate('images').exec((err, user) =>
                        user.images.forEach((image) => image._id == imageId && image.remove())
                    )
                    // if (!deleteUser) return res.status(400).json({ success: false })

                    // deleteUser.images.map(async (image) => {
                    //     await Image.findByIdAndRemove(image._id)
                    // })
                }

                res.status(200).json({ success: true, data: {} })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}
