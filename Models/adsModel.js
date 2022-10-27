const mongoose = require("mongoose");

const AdSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:6,

    },
    description:{
        type:String,
        min:10
    },
    plan:{
        type:String,
        required:true,

    },
    planDay:{
        type:Number,
        required:true,

    },
    isBlocked:{
        type:Boolean,
        required:false,

    },
    
    file:{
        type:String,


    },
    startedAt:{
        type:String,
        
    },
    endAt:{
        type:String,
        
    }, 
    ownerId:{
        type:String,
        required:true,

    },
    paymentId:{
        type:String,
        required:true,

    },
    statu:{
        type:String,
        default:"Pending",
        
    },
   
    createdAt:{
        type:Date,
        default:Date.now,
    },
    timestamps: Number
},{ timestamps: true });

module.exports = mongoose.model("Ad",AdSchema);

