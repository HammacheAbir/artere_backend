import dotenv from 'dotenv';
dotenv.config();

import express,{Express} from "express"
import { connectToMongoDB } from "./db"
import { router as catalogRouter } from "./routes/catalog.route"
import cors from 'cors';

const app:Express = express()

app.use(cors());
app.use(express.json())

app.use("/api/catalog", catalogRouter)


app.get("/", (req, res) => {
    res.send("Hello")
})

connectToMongoDB().then(() => {
    app.listen(5000, () => {
        console.log("listening to server on port 5000")
    })
})

