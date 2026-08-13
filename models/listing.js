const mongoose = require("mongoose")
const review = require("./review")
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        filename:{
            type:String,
            default:"listimage"
        },
        url:{
             type: String,
             set: (v)=> v === ""? "https://res.cloudinary.com/dcfaddjtn/image/upload/v1772547011/eprpirdhcog2dimc3gf4.png" : v
        }
       
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing