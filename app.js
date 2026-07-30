const express = require("Express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")

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

app.get("/testlisting",async (req, res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description : "By the beach",
        price : 1200,
        location: "Calangute, Goa",
        country: "India"
    })

    await sampleListing.save()
    console.log("sample was saved")
    res.send("sucessful testing")
})

app.listen(8080,()=>{
    console.log("Server is on port 8080")
})