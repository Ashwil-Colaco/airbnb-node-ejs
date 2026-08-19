module.exports.isLoggedIn = (req,res,next)=>{
      if(!req.isAuthenticated()){ // checks if user is logged in
        req.flash("error","you must be logged in")
        return res.redirect("/login")
    }
    next()
}