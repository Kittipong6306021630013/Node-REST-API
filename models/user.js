
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: String,
    password: String,
    name:String,
    room:Number,
    elec_use:Number,
    roomate:Number,
    Status:false,
    image : String
        
  })
module.exports = mongoose.model("User",userSchema)