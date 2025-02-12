// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({ 
    path: "./.env"
})

const PORT = process.env.PORT || 8001
connectDB()
.then(() => {
    app.listen(PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})() */