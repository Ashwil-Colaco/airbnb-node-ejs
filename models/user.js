const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose").default //auto implements hashed password and salting


const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
}) // passport local mongoose auto creates username field in user schema

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",userSchema)