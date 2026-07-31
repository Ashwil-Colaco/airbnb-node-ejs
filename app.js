const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

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
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({})
     console.log(allListings)  
     res.render("listings/index.ejs",{allListings})
  
})

//new route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params
    const listing = await Listing.findById(id)      //finding that particular list to edit 
    res.render("listings/edit.ejs",{listing})
})

//show route

app.get("/listings/:id",async (req,res) =>{
    let{id} = req.params
    console.log(id)
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs",{listing})
})

//create route

app.post("/listings",async (req,res)=>{
   let listing = new Listing(req.body.listing)
   await listing.save() //new data is saved in db
   res.redirect("/listings")  

})

//update route

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,req.body.listing)
    res.redirect(`/listings/${id}`)
})

//delete
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params
    let deletedData = await Listing.findByIdAndDelete(id)
    console.log(deletedData)
    res.redirect("/listings")
})


app.listen(8080,()=>{
    console.log("Server is on port 8080")
})