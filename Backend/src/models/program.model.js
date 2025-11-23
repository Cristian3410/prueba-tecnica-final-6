import mongoose from "mongoose";


const programSchema = new mongoose.Schema({

    name:{
      type:String,
      required:true,
      trim:true,
      unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    startDate:{
       type:Date,
       required:true
    },

status:{
    type:String,
    enum:["active","inactive"],
    default:"active",
}

},{
    timestamps:true
});

export default mongoose.model("Program", programSchema)