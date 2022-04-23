require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://admin:1234@cluster0.co4mq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = require('./routes/route')
app.use(router)

app.listen(3000, () => console.log('Server Started'))
