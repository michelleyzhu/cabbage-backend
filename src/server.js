import express from 'express'
import bodyParser from "body-parser"
import {MongoClient} from "mongodb"
import path from 'path'
const app = express()
app.use(express.static(path.join(__dirname, "/build")))
app.use(bodyParser.json())

const withDB = async (operation, res) => {
    try{
        console.log('attempting to connect')
        const client = await MongoClient.connect(/*process.env.MONGODB_URI || */"mongodb+srv://cabbageDb:peachDb@cluster0.b6n76.mongodb.net/<dbname>?retryWrites=true&w=majority",
        {useNewUrlParser:true, useUnifiedTopology:true})
        const db = client.db("cabbageData")
    
        await operation(db)

        client.close()
    } catch(error) {
        res.status(500).json({message:`There was an error${error}`})
        console.log('failed to connect')
    }
}

app.get("/api/produce", async (req,res) => {
    withDB(async db => {
        await db.collection("images").insert({id:"helloid"})
        const update = await db.collection("images").findOne({id:"helloid"})
        res.status(200).json(update)
    }, res)
})

app.post("/api/produce/upload-file", async (req,res) => {
    file = req.file
    withDB(async db => {
        await db.collection("images").insert({id:file.name, image:file})
        const updatedImage = await db.collection("images").findOne({id:file.name})
        res.status(200).json(updatedImage)
    }, res)
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/build/index.html"))
})

const PORT = process.env.PORT || 8000;
//const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});