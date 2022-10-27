const MailRoom = require("../Models/mailRoom");

const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;



module.exports.createMailRoom = async (req,res) =>{
     
      
    try {
        const mails=[];
        //save mail room
        for (let index = 0; index < req.body.adress.length; index++) {
            console.log(req.body.adress);
            // list of map
            const adressMap = req.body.adress[index];
            const key= req.body.Uid+"-DevMerryck-"+adressMap["id"]
            console.log(key);

            // cheking
            console.log("start creation");
            const findMail=await  MailRoom.find({
                "key": {
                  "$regex": req.body.Uid, 
                  "$options": "i"
                },
                "adress":adressMap["mailAdress"],
            })
            console.log(findMail);
            if (findMail.length!=0 && mails.includes(findMail[0])==false) {
                // chck if mails list contain val
                mails.push(findMail[0])

               

            }else{
                // Ccheck ,if user is contact
                 //create the room
            const newMailRoom = new MailRoom({
                receiverId:adressMap["id"],
                key:key,
                adress:adressMap["mailAdress"],
            }); 
                const mailRoom = await newMailRoom.save();
                mails.push(mailRoom);
            }
           

            
        }
        console.log("mails");

        console.log(mails);

        //add group id to  user groupList
        return res.status(200).json(mails);


    
    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
    } 
// add contact
module.exports.addMailRoom = async (req,res) =>{
    console.log("start creation");
    const findMail=await MailRoom.find({
        "key": {
          "$regex": req.body.Uid, 
          "$options": "i"
        },
        "adress":adressMap["mailAdress"],
    })
    console.log(findMail);
    if (findMail.length!=0) {
        return res.status(405).json({error:'Error! This mail exist'});

    } else {
       //create the room
    const newMailRoom = new MailRoom({
        receiverId:req.body.receiverId,
        key:req.body.key,
        adress:req.body.adress,
        

    }); 
    try {
        //save mail room
        const mailRoom = await newMailRoom.save();
        //add group id to  user groupList
        return res.status(200).json(mailRoom);


    
    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
    } 

   
}

   


// delete 
module.exports.deleteMailRoom = async (req,res) =>{
    console.log("start delete");
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send({"message":"Cet utilisateur n'existe pas"})
    }
    
    try {
       MailRoom.findByIdAndDelete(req.params.id,((err,doc)=>{
            if (!err) {
            return res.status(200).json({sucess:"Delete Done."})
                console.log(doc);
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


// find room where key contain user id 
module.exports.findRoom = async (req,res) =>{
    console.log("start find");
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send({"message":"Cet utilisateur n'existe pas"})
    }
    
    try {
      MailRoom.find( {
        "key": {
          "$regex": req.params.id, 
          "$options": "i"
        } ,
      },).populate('mailList').sort({updatedAt:-1 }).exec(((err,doc)=>{
        if (!err) {
            console.log(doc); 
        return res.status(200).json({doc})

        } else { 
            console.log(err);
        res.status(404).send({"message":"Cet utilisateur n'existe pas"})

        } 
      }))
    
    }catch(err){ 
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}