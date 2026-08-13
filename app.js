const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test')
}

main()
    .then(() => {
        console.log("DB Connected")
    })
    .catch((err) => {
        console.log("Db not connected", err)
    })


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

app.get("/", (req, res) => {
    res.send("YO WASSUP im the root")
})

// app.get("/testlisting",async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     })

//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send("sucessful testing")
// })

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    console.log(allListings)
    res.render("listings/index.ejs", { allListings })

})

//new route

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)      //finding that particular list to edit 
    res.render("listings/edit.ejs", { listing })
})

//show route

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params
    console.log(id)
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})

//create route

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
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
    res.redirect("/listings")
}))

//update route

app.put("/listings/:id", async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data")
    }
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, req.body.listing)
    res.redirect(`/listings/${id}`)
})

//delete
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    let deletedData = await Listing.findByIdAndDelete(id)
    console.log(deletedData)
    res.redirect("/listings")
})

//review
app.post("/listings/:id/reviews", validateReview,wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()

    console.log("new review saved")
    res.send("new review saved")
}))


// app.use((err,req,res,next)=>{
//     res.send("Something is wrong")
// })
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err
    res.status(status).render("Error.ejs", { message })
    // res.status(status).send(message)
})




app.listen(8080, () => {
    console.log("Server is on port 8080")
})