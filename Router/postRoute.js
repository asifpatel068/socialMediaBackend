const express=require("express")

const jwt=require("jsonwebtoken");
const { UserModel } = require("../Model/userModel");

const { auth } = require("../Middleware/auth");
const { PostModel } = require("../Model/postModel");

const postRouter=express.Router();

postRouter.get("/",async(req,res)=>{
    try{
        const posts=await PostModel.find();
        res.status(200).send({posts:posts})
    }catch(err){
        res.status(500).send({error:err})
    }
})

postRouter.post("/",auth,async(req,res)=>{
    try{
        const {text,image}=req.body
        const userId=req.user.userId
        console.log(Date.now())
        const post =new PostModel({user:userId,text,image,Date})
        await post.save()

        res.status(201).send({message:"Post Created"})
    }catch(err){
        res.status(500).send({error:err})
    }
})


postRouter.patch("/:id",auth,async(req,res)=>{
    try{
        const postId=req.params.id
        const payload=req.body
        const userId=req.user.userId
    
        const posts=await PostModel.findByIdAndUpdate({_id:postId},payload)
        console.log(posts)
        res.status(201).send({message:"Post updated"})
    }catch(err){
        res.status(500).send({error:err})
    }
})


postRouter.delete("/:id",auth,async(req,res)=>{
    try{
        const postId=req.params.id
        const userId=req.user.userId
    
        const posts=await PostModel.findByIdAndDelete({_id:postId})
        console.log(posts)
        res.status(201).send({message:"Post deleted"})
    }catch(err){
        res.status(500).send({error:err})
    }
})

postRouter.get("/:id",auth,async(req,res)=>{
    try{
        const postId=req.params.id
     
        const userId=req.user.userId
    
       const post= await PostModel.findOne({_id:postId})
 
        res.status(201).send({post:post})
    }catch(err){
        res.status(500).send({error:err})
    }
})

postRouter.post("/:id/like",auth,async(req,res)=>{
    try{
        const postId=req.params.id
        const userId=req.user.userId
    
       const post= await PostModel.findOne({_id:postId})
        if(!post){
            return res.status(404).send({error:"post not found"})
        }

        const liked=post.likes.includes(userId);
        if(liked){
            return res.status(400).send({error:"post already liked"})
        }

        post.likes.push(userId);
        await post.save();

        res.status(201).send({message:"Post Liked Success"})
    }catch(err){
        res.status(500).send({error:err})
    }
})


postRouter.post("/:id/comment",auth,async(req,res)=>{
    try{
        const postId=req.params.id
        const userId=req.user.userId
        const {text}=req.body
    
       const post= await PostModel.findOne({_id:postId})
        if(!post){
            return res.status(404).send({error:"post not found"})
        }

        const comment={user:userId,text}

        post.comments.push(comment);
        await post.save();

        res.status(201).send({message:"comment added Successfully"})
    }catch(err){
        res.status(500).send({error:err})
    }
})



module.exports={
    postRouter
}