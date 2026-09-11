const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    console.log(id)
    const listing = await Listing.findById(id).populate("reviews").populate("owner")
    console.log(listing)
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    console.log(url,"..",filename)
    let listing = new Listing(req.body.listing)
    listing.owner = req.user._id
    listing.image = {url, filename}
    await listing.save()
    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }

    let originalUrl = listing.image.url
    originalUrl = originalUrl.replace("/upload", "/upload/h_200,w_300")
    res.render("listings/edit.ejs", { listing , originalUrl})
}

module.exports.updateListingForm = async(req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data")
    }
    let { id } = req.params
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing)

    if(typeof req.file !== "undefined"){
        let url=req.file.path
        let filename=req.file.filename
        listing.image = {url, filename}
        await listing.save()
    }

    req.flash("success", "Updated the list!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req, res) => {
     let { id } = req.params
    let deletedData = await Listing.findByIdAndDelete(id)
    console.log(deletedData)
    req.flash("success", "Deleted existing list!")
    res.redirect("/listings")
}