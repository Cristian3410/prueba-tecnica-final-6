import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },

    password:{
        type:String,
        required:true,

    },
    
    programId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Program",
        required:false
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }

    
}, {
    timestamps:true
   })

export default mongoose.model("User", userSchema)