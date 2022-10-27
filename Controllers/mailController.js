const MailModel = require("../Models/mailModel");
const MailRoom = require("../Models/mailRoom");


const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;



module.exports.createMail = async (req,res) =>{
    console.log("start creation");
    

    //create the room
    const email = new MailModel({
        subject:req.body.subject,
        content:req.body.content,
        room:req.body.roomId,
        sender:req.body.sender,
        receiver:req.body.receiver,

    });

    try {
        //save mail 
        const mail = await email.save();
        // FIND room
        const id =  req.body.roomId
        const key= req.body.sender+"-DevMerryck-"+req.body.receiver
        MailRoom.findByIdAndUpdate(
           id,
            {$push:{
                mailList:mail._id
            }},
            {new:true,upsert:true},
            ((err,doc)=>{
                if (!err) { 
                    console.log(doc);
                } else {
                    console.log(err);
        res.status(400).send({error:'Error! Try later'})
                    
                }
            })

        )

        return res.status(200).json(mail);

    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}

// // find mails by room 
// module.exports.findMails = async (req,res) =>{
//     console.log("start find");
//     if (!ObjectId.isValid(req.params.id)) {
//         res.status(404).send({"message":"Cet utilisateur n'existe pas"})
//     }
    
//     try {
//        MailModel.findByIdAndDelete(req.params.id,((err,doc)=>{
            // if (!err) {
            //     console.log(doc);
            //     return res.status(200).json({sucess:"Delete Done."})
            // } else {
            // res.status(404).send({error:'Error Not found'})
            //     console.log(err);
                
            // }
//        }))
    
//     }catch(err){
//         res.status(400).send({error:'Error! Try later'})
//         console.log(err) 
//     }
// }

// delete 
module.exports.deleteMail = async (req,res) =>{
    console.log("start delete");
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send({"message":"Cet utilisateur n'existe pas"})
    }
    
    try {
       MailModel.findByIdAndDelete(req.params.id,((err,doc)=>{
            if (!err) {
                console.log(doc);
                return res.status(200).json({sucess:"Delete Done."})
            } else {
            res.status(404).send({error:'Error Not found'})
                console.log(err);
                
            }
       }))
    
    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}

// delete 
module.exports.updateMailStatu = async (req,res) =>{
    console.log("start update");
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send({"message":"Cet utilisateur n'existe pas"})
    }
    
    try {
       MailModel.findByIdAndUpdate(
        req.params.id,
        {seen:true},
        {new:true,upsert:true},

        ((err,doc)=>{
            if (!err) {
                console.log(doc);
                return res.status(200).json({sucess:"update Done."})
            } else {
            res.status(404).send({error:'Error Not found'})
                console.log(err);
                
            }
       }))
    
    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}