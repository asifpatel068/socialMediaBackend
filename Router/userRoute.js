const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { UserModel } = require("../Model/userModel");
const { auth } = require("../Middleware/auth");

const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    try{
        const {name,email,password,dob,bio}=req.body;

        const exitsUser=await UserModel.findOne({email});
        if(exitsUser){
            return res.status(400).send({message:"Email Already Exits"})
        }
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                return res.status(400).send({error:err.message})
            }
            const user=new UserModel({name,email,password:hash,dob,bio})

            await user.save()
            res.status(201).send({messege:"User Register Successfully"})
        })

    }catch(err){
        res.status(500).send({error:err.messege})
    }
})

userRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;

        const User=await UserModel.findOne({email});
        
        if(User==null){
            return res.status(400).send({error:"User Doesn't Exits"})
        }
        const hashedpass=User?.password
        bcrypt.compare(password,hashedpass,async(err,result)=>{
            if(err){
                return res.status(400).send({error:err.message})
            }
            if(!result){
                return res.status(400).send({error:"Wrong Credentials"})
            }
            
            const token=jwt.sign({userId:User._id},"NORMAL");

            res.status(201).send({messege:"User login Successfully",token})
        })

    }catch(err){
        res.status(500).send({error:err})
    }
})
//get
userRouter.get("/users",async(req,res)=>{
    try{
        const users=await UserModel.find();
        res.status(200).send({users:users})
    }catch(err){
        res.status(500).send({error:err})
    }
})

userRouter.get("/users/:id/friends",auth,async(req,res)=>{
    const userID=req.params.id
    try{
        const users=await UserModel.findOne({_id:userID});
        if(!users){
            return res.status(400).send({error:"User Doesn't Exits"})
        }
        res.status(200).send({friends:users.friends})
    }catch(err){
        res.status(500).send({error:err})
    }
})

userRouter.post("/users/:id/friends",auth,async(req,res)=>{
    const userID=req.params.id
    const data=req.body
    const friendId=data.friendId
    try{
        const user=await UserModel.findById(userID);
        if(user.friends.includes(friendId)){
            return res.status(400).send({error:"Already friend"})
        }
        const friend=await UserModel.findById(friendId);
        if(!user || !friend){
            return res.status(400).send({error:"User or friend Doesn't Exits"})
        }
        user.friendRequests.push(friendId)
        res.status(200).send({messege:"Friend Request Sent"})
    }catch(err){
        res.status(500).send({error:err})
    }
})

userRouter.put("/users/:id/friends/:friendId",auth,async(req,res)=>{
    const userID=req.params.id;
    const friendId=req.params.friendId;
    const accept=req.body.accept
    try{
        const user=await UserModel.findById(userID);
      
        const friend=await UserModel.findById(friendId);
     
        if(!user || !friend){
            return res.status(400).send({error:"User or friend Doesn't Exits"})
        }
        user.friendRequests.pull(friendId)

        if(accept){
            user.friends.push(friendId)
            friend.friends.push(userID)
            await friend.save()
        }
        
        await user.save()
        res.status(200).send({messege:"Friend Request accepted"})

    }catch(err){
        res.status(500).send({error:err})
    }
})



module.exports={
    userRouter
}