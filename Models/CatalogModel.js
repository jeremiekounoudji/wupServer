const mongoose = require("mongoose");

const CatalogSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,

    },
    description:{
        type:String,
        min:10
    },
    catalogLocation:{
        type:String,
    },
    availHours:{
        type:[{
            "day":String,
            "isSelected":Boolean,
            "isTwoHours":Boolean,
            "firstHour":String,
            "firstHour2":String,
            "secondHour":String,
            "secondHour2":String,

        }],
    },
    imgProfil:{
        type:String, 

    },
    followers:{
        type:[String],
    },
    partners:{
        type: [String],
    },
    products:{
        type:[String],
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

module.exports = mongoose.model("Catalog",CatalogSchema);

