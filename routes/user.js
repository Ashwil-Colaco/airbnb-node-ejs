const express = require("express")
const router = express.Router()
const user = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
    let {username, email, password} = req.body
    const newUser = new user({email, username})
    const registeredUser = await user.register(newUser, password)    
    console.log(registeredUser)
    req.flash("success", "user was registered successfully")
    res.redirect("/listings")
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})


//passport.authenticate is a middleware
router.post("/login",passport.authenticate("local",{failureRedirect : '/login', failureFlash: true}),async(req,res)=>{   //passport.authenticate("local"): This invokes the local authentication strategy to check the submitted username and password against your database.
    //failureRedirect: '/login': If authentication fails, Passport automatically redirects the user back to the /login page instead of letting the request proceed.
    //failureFlash: true: If login fails, this enables flash messages. It automatically passes the error message (like "Invalid username or password") to your flash utility so you can display it to the user.
    req.flash("success","Welcome to WanderLust! You are logged in")
    res.redirect("/listings")
})

router.get("/logout",(req,res,next)=>{ // to logout
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings")
    })
})

module.exports = router