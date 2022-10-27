const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema({
    name:{
        type:String, 
        required:true,
        min:6,

    },
    description:{
        type:String,
        min:10
    },
    imgProfil:{
        type:String, 

    },
    members:{
        type:[String],
        required:true,
    },
    admins:{
        type:[String],
        required:true,
    },
    owner:{
        type:String,
        required:true,

    },
    isPublic:{
        type:Boolean,
        required:true,

    },
   
    createdAt:{
        type:Date,
        default:Date.now,
    },
    timestamps: Number
},{ timestamps: true });

module.exports = mongoose.model("Channel",ChannelSchema);