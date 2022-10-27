const mongoose = require("mongoose");

const mailRoomSchema = mongoose.Schema({
    key:{
        type:String,
        required:true,

    },
    adress:{
        type:String,
        required:true,

    },
    receiverId:{
        type:String,
        required:true,

    },
    isBlocked:{
        type:Number,
        required:true,
        default:0

    },
    isContact:{
        type:Number,
        required:true,
        default:1
    },
    mailList:[{
        type:mongoose.Schema.Types.ObjectId,ref:"Mail"

    }],
    
    createdAt:{
        type:Date,
        default:Date.now,
    },
    timestamps: Number
},{ timestamps: true });

module.exports = mongoose.model("MailRoom",mailRoomSchema);
