const jwt = require('jsonwebtoken')
const jwt_key = process.env.jwt_key
const auth = async (req,res,next)  => {
    let token = req.header('Authorization')
    try{
    let decoded = await jwt.verify(token,jwt_key)
    req.decoded = decoded
    next()
    }catch(err)
    {
        console.error(`Invild Token : ${err}`)
        res.status(500).json({error:err})
        return
    }
}

module.exports = auth