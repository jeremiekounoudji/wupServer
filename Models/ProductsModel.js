const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,

    },
    description:{
        type:String,
        min:10
    },
    price:{
        type:String,
        required:true,

    },
    imgProfil:{
        type:[String], 
        required:true,

    },
    likes:{
        type:[String],
    },
    isAvailable:{
        type:Boolean,
        required:true,

    },
    
    catalogId:{
        type:String,
        required:true,

    },
    rate:{
        type:String,

    },
    comments:{
        type:[
            {
                commenterId:String,
                commenterName:String,
                commenterImg:String,
                commentBody:String,
                commentDate:{
                    type:Date,
                    default:Date.now,
                }
            }
        ],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    timestamps: Number
},{ timestamps: true });

module.exports = mongoose.model("Product",ProductSchema);
