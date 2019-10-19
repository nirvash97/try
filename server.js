const express = require('express')
const app = express()
const mongodb = require('mongodb')
const bcrypt = require('bcryptjs')
const port = process.env.PORT
app.use(express.json())
const MongoClient = mongodb.MongoClient
const MONGODB_URL = process.env.MONGODB_URL
// console.log(`MONGODB_URL: ${process.env.MONGODB_URL}`)
app.post('/register' , async (req,res) => {
let name = req.body.name
let email = req.body.email
let studenId = req.body.studentId
let EncryptPW = await bcrypt.hash(req.body.password,8)

    const o = {
        name :name,
        email :email,
        studenId:studenId,
        password : EncryptPW
    }
    const client = await require('./db')
   
    const db = client.db('BUU')
    const result = await db.collection('users').insertOne(o).catch((err) => { /***************************** */
        console.error(`Cannot Isert data to user collection : ${err}`)
        res.status(400).json({error:err})
        console.log(`insert result: ${result}`)
        return
    })
    let r = { _id : o._id, name : o.name, email : o.email , studenId : o.studenId}
    res.status(201).json(r)

})



app.listen(port, () => {
    console.log(`Pokemon!! API listening on port ${port}!`)
}) // start server