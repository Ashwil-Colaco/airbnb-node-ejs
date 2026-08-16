const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")


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

//Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({})
    console.log(allListings)
    res.render("listings/index.ejs", { allListings })

})

//new route

router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//edit route
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)      //finding that particular list to edit 
    res.render("listings/edit.ejs", { listing })
})

//show route

router.get("/:id", async (req, res) => {
    let { id } = req.params
    console.log(id)
    const listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        return res.redirect("/listings")// i tried to do directly res.direct... it didnt work so i did return res... then it worked
    }
    res.render("listings/show.ejs", { listing })
})

//create route

router.post("/", validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "send valid data")
    // }
    // let result = listingSchema.validate(req.body) // checks if all checks specified by joi in schema.js is satisfied in req.body.listing
    // console.log(result)
    // if(result.error){
    //     throw new ExpressError(400,"Validation err")
    // }
    let listing = new Listing(req.body.listing)
    await listing.save() //new data is saved in db
    req.flash("success","New Listing Created!")
    res.redirect("/listings")
}))

//update route

router.put("/:id", async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data")
    }
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, req.body.listing)
     req.flash("success","Updated the list!")
    res.redirect(`/listings/${id}`)
})

//delete
router.delete("/:id", async (req, res) => {
    let { id } = req.params
    let deletedData = await Listing.findByIdAndDelete(id)
    console.log(deletedData)
    req.flash("success","Deleted existing list!")
    res.redirect("/listings")
})


module.exports = router