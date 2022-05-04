const express = require('express')
require('dotenv').config()
const db = require('./database/connection')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')

const app = express()
const port = process.env.PORT || 8000

//middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/images',express.static('public/uploads'))
app.use(cookieParser())


//routes
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)

// to start server
app.listen(port, ()=>{
    console.log(`server started at ${port}`)
})
