const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:6,
        // unique:true

    },
    
    seeChannels:{
        type:String,
        default:"EVERYBODY",
        required:true,

    },
    seeGroups:{ 
        type:String,
        default:"EVERYBODY",
        required:true,

    },
    seeCatalogs:{
        type:String,
        default:"EVERYBODY",
        required:true,

    },
    seeProfilev:{
        type:String,
        default:"EVERYBODY",
        required:true,

    },
    countrycode:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    fullphone:{
        type:String,
        required:true,
    },
    ProfilePicture:{
        type:String,
        // required:true,
    },
    bio:{
        type:String,
        required:true,
        default:"Hey! What up?"

    },
    email:{
        type:String,require:true,
    },
    contacts:{
        type: [
            String
        ],
        required:true,
    },
    catalog:{
        type: [{
            "id": String,
            "isPartner":Boolean
        }],
        required:true,
    },
    
    channels:{
        type:[String],
        required:true,
    },
    groups:{
        type:[String],
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
},{ timestamps: true } );

module.exports = mongoose.model("User",UserSchema);