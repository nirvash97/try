const express = require('express')
const app = express()
const mongodb = require('mongodb')
const port = process.env.PORT
app.use(express.json())
const MongoClient = mongodb.MongoClient
const MONGODB_URL = process.env.MONGODB_URL
// console.log(`MONGODB_URL: ${process.env.MONGODB_URL}`)
app.post('/register' , async (req,res) => {
let name = req.body.name
let email = req.body.email
let studenId = req.body.studentId
let password = req.body.password

    const o = {
        name :name,
        email :email,
        studenId:studenId
    }
    const client = await MongoClient.connect(MONGODB_URL ,  {
        useNewUrlParser : true,
        useUnifiedTopology :true
    }).catch((err) => {
        console.error(`Cannot Connet to mongod : ${err}`)
        res.status(500).json({error:err})
        return
    })
    const db = client.db('BUU')
    const result = await db.collection('users').insertOne(o).catch((err) => {
        console.error(`Cannot Isert data to user collection : ${err}`)
        res.status(400).json({error:err})
        console.log(`insert result: ${result}`)
        return
    })
   


    res.status(201).json(o)

})



app.listen(port, () => {
    console.log(`Pokemon!! API listening on port ${port}!`)
}) // start server