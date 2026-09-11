const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

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

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"6a85303e45b64d4f592aa73a"}))
    
    await Listing.insertMany(initData.data);
    console.log("DAta is initited")
}

initDB()