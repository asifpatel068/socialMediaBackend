const {Schema,default:mongoose}=require("mongoose")

const userSchema= mongoose.Schema({
        name: String,
        email: String,
        password: String,
        dob: Date,
        bio: String,
        posts: [{ type:Schema.Types.ObjectId, ref: 'Post' }],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const UserModel=mongoose.model("User",userSchema)

module.exports={
    UserModel
}