const express = require("express")
const router = express.Router({mergeParams:true})// this is done so that thw control from app.js comes to here ad doesnt get struck because of /:id
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        next(new ExpressError(400, errMsg))// print more detailed err ms
        // throw new ExpressError(400, error)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        next(new ExpressError(400, errMsg)) // print more detailed err ms
        // throw new ExpressError(400, error)
    } else {
        next()
    }
}

//review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()

    console.log("new review saved")
    res.send("new review saved")
}))

//delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))

module.exports = router