const express = require("express")
const app = express()
const users = require("./routes/users.js")
const posts = require("./routes/posts.js")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")
const ejsMate = require("ejs-mate")

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))


const sessionOptions = {
    secret : "mysupersecretstring", 
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOptions)) //creates connect.sid(session id), resave and saveUninitialized removes warnings in terminal
app.use(flash())
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error") // flash msges are temperorily stored in session deleted when refreshed
    next()
})


app.get("/request",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1
    }
    res.send("totsl requests is ${req.session.count}")
})

app.get("/register",(req,res)=>{
    let {name="joel"} = req.query //localhost:3000/register?name="ellie"  will display ellie
    console.log(req.session) // output is same as the col names in applications
    req.session.name= name
    req.flash("success","user registered successfully") // connect - flashh
    // res.send(name)
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
//    res.send(`HI ${req.session.name}`)
    // const flashMsg = req.flash("success")
    // console.log(flashMsg)
    res.render("page.ejs",{
        name : req.session.name,
    }) //displaying flash messages using ejs
})

app.get("/test",(req,res)=>{
    res.send("test succesfull")
})










// const cookieParser = require("cookie-parser")

// app.use(cookieParser("secretcode"))

// app.get("/getcookies", (req,res)=>{
//     res.cookie("great","hello",{signed:true})
//     res.send("sent signed cookies")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("verified signed cookie")
// })


app.get("/greet",(req,res)=>{
    let {name = "anonymous"} = req.cookies
    res.send(`Hi, ${name}`)
})

app.use("/users",users)//no need to write /users.. in ser.js becuase we have added the prefix here
app.use("/posts",posts)


app.listen(3000,()=>{
    console.log("server is listenning to 3000")
})