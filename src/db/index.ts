import mongoose from "mongoose"

export const connectToMongoDB = async () => {
    return mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Connected to database")
    }).catch((error) => {
        console.log(error)
    })
}