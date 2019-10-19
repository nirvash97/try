const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const MONGODB_URL = process.env.MONGODB_URL
module.exports = (async () => {
    const client = await MongoClient.connect(MONGODB_URL ,  {  //**************************/
        useNewUrlParser : true,
        useUnifiedTopology :true
    })
    return client
})()

// const client = await MongoClient.connect(MONGODB_URL ,  {  //**************************/
//     useNewUrlParser : true,
//     useUnifiedTopology :true
// }).catch((err) => {
//     console.error(`Cannot Connet to mongod : ${err}`)
//     res.status(500).json({error:err})
//     return
// })