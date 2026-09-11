const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingContoller = require("../controllers/listings.js")
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage }) //initially the file was saved in uploads now in storage of cloudinary

router.route("/")
    .get(wrapAsync(listingContoller.index))
    .post(upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingContoller.createListing)
        // res.send(req.file)
    )


router.get("/new", isLoggedIn, listingContoller.renderNewForm)

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingContoller.renderEditForm))

router.route("/:id")
    .get(wrapAsync(listingContoller.showListing))
    .put(isLoggedIn, isOwner, 
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingContoller.updateListingForm))
    .delete(isLoggedIn, isOwner, wrapAsync(listingContoller.destroyListing))

module.exports = router