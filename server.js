const express = require('express')
const app = express()
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Pokemon!! API listening on port ${port}!`)
}) // start server