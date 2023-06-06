const jwt=require("jsonwebtoken");

const auth=async(req,res,next)=>{
    const token=req.headers.authorization;

    if(!token){
        return res.status(401).send({error:"Unauthorized, Please Login"})
    }
    try{
        const decoded=jwt.verify(token,"NORMAL");
        if(decoded){
             req.user={userId:decoded.userId};
            next()
        }
       
    }catch(err){
        return res.status(401).send({error:"Unauthorized error, Please Login"})
    }
}

module.exports={
    auth
}