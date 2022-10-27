const mongoose = require("mongoose");

const mailSchema = mongoose.Schema({
    subject:{
        type:String,

    },
    content:{
        type:String,
        min:10,
        required:true,

    },
    room:{
        type:mongoose.Schema.Types.ObjectId,ref:"MailRoom"

    },
    files:{
        type:[String],

    },
    isSent:{
        type:Number,
        required:true,
        default:1

    }, 
    seen:{
        type:Number,
        required:true,
        default:1

    },
    sender:{
        type:String,
        required:true,

    },
    receiver:{
        type:String,
        required:true,

    },
   
    createdAt:{
        type:Date,
        default:Date.now,
    },
},{ timestamps: true });

module.exports = mongoose.model("Mail",mailSchema);
