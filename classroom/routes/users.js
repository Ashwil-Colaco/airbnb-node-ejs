const express = require("express")
const router = express.Router()

//users
//index
router.get("/",(req,res)=>{
    res.send("get for users")
})

//show
router.get("/:id",(req,res)=>{
    res.send("get for show users")
})

//post
router.post("/",(req,res)=>{
    res.send("post for users")
})

router.delete("/:id",(req,res)=>{
    res.send("delete for users")
})

module.exports = router