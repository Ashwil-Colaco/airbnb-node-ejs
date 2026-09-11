const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, validateListing, validateReview } = require("../middleware.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const reviewController = require("../controllers/reviews.js")

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

router.delete("/:reviewId", wrapAsync(reviewController.destroyReview))

module.exports = router