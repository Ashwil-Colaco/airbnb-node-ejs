const mongoose = require("mongoose")
const Review = require("./review.js")
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        filename: {
            type: String,
            default: "listimage"
        },
        url: {
            type: String,
            set: (v) => v === "" ? "https://res.cloudinary.com/dcfaddjtn/image/upload/v1772547011/eprpirdhcog2dimc3gf4.png" : v
        }

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
}) // deletes review when a particular listing is deleted

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing