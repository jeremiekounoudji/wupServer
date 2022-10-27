const mongoose = require("mongoose")


 mongoose.connect(
    //lien de connection,

    // "mongodb+srv://whath-up:soft%4095++@cluster0.qvudu.mongodb.net/what-up?retryWrites=true&w=majority",
    // "mongodb://localhost:27017/what-up",
    process.env.DB_CONNECT|| "mongodb+srv://whath-up:soft%4095++@cluster0.qvudu.mongodb.net/what-up",
    //header
    {useNewUrlParser:true,},
    
).then(()=>console.log('coonected to db'))
.catch((err)=>console.log('no connect',err))       