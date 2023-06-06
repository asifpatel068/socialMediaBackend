const express=require("express");
const { connection } = require("./Config/db");
const { userRouter } = require("./Router/userRoute");
const { postRouter } = require("./Router/postRoute");

const port=3000
const app=express();
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Welcome to SocialMedia Backend")
})
app.use("/api",userRouter)
app.use("/api/posts",postRouter)
app.listen(port,async()=>{
    try{
        await connection
        console.log("Connected to DB")
    }catch(err){
        console.log(err)
        console.log("Not Connected to DB")
    }
    console.log(`Server is running at ${port}`)
})