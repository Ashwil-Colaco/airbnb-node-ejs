const user = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res,next) => {
    try {
        let { username, email, password } = req.body
        const newUser = new user({ email, username })
        const registeredUser = await user.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "couldnt login automatically")
                return next(err)
            }
            req.flash("success", "user was registered successfully")
            res.redirect("/listings")
        })

    } catch (err) {
        req.flash("error", err.message)
        return res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to WanderLust! You are logged in")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        return res.redirect("/listings")
    })
}