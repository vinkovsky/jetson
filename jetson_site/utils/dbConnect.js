import mongoose from 'mongoose'

//connect to db 

async function dbConnect() {

  //return if connetcion exist 

  if (mongoose.connection.readyState >= 1) {
    return
  }

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

export default dbConnect
