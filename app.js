const express = require("Express")
const app = express()
const mongoose = require("mongoose")

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/test')
}

main()
.then(()=>{
    console.log("DB Connected")
})
.catch((err)=>{
    console.log("Db not connected",err)
})

app.get("/",(req,res)=>{
    res.send("YO WASSUP im the root")
})

app.listen(8080,()=>{
    console.log("Server is on port 8080")
})