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
const review = require("./models/review.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")
const listings = require("./routes/listings.js")
const reviews = require("./routes/review.js")
const user = require("./routes/user.js")

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


const sessionOptions = {
    secret : "mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expiry:Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions)) //you can verify in applictaions in inspect to check of session id was created
app.use(flash()) // for flash msges
//to use passport we need a session storage.. which is up here


app.use(passport.initialize()) // Sets up Passport authentication middleware for the app
app.use(passport.session()) // Links Passport to your session storage to keep users logged in
passport.use(new localStrategy(User.authenticate())) // Uses a local username and password strategy for logging in

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user // because we cant use req.user directly in ejs
    next()
})

app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email:"Student@gmail.com",
        username:"delta-student"
    })
    let registeredUser = await User.register(fakeUser,"helloworld")// also while authenticating, passport automatically checks if the user is unique
    res.send(registeredUser)
})

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)
app.use("/",user)

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