if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

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
const { MongoStore } = require('connect-mongo');
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

const URL = process.env.ATLAS_URI

async function main() {
    await mongoose.connect(URL)
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
        next(new ExpressError(400, errMsg))
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        next(new ExpressError(400, errMsg))
    } else {
        next()
    }
}

const store = MongoStore.create({
    mongoUrl: URL,
    crypto: {
        secret: process.env.secret
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store:store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "Student@gmail.com",
        username: "delta-student"
    })
    let registeredUser = await User.register(fakeUser, "helloworld")
    res.send(registeredUser)
})

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)
app.use("/", user)

// app.get("/", (req, res) => {
//     res.send("YO WASSUP im the root")
// })

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err
    res.status(status).render("Error.ejs", { message })
})

app.listen(8080, () => {
    console.log("Server is on port 8080")
})