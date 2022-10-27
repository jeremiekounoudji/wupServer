const User = require("../Models/UserModel");
const ObjectId = require("mongoose").Types.ObjectId;
// const bcrypt = require('bcrypt');
const fs = require("fs");
const {promisify} = require('util');
const { populate } = require("../Models/UserModel");
const pipeline = promisify(require('stream').pipeline)


// get all contact for one user
module.exports.getAllContact = async (req,res) =>{ 
    
    try {
        User.findById(
            req.params.id,
            (err,doc)=>{
                if(!err){
                    const UserContact = doc.contacts
                    res.status(200).send(UserContact)
                }else{
                    res.status(400).send(err)
                }
            }
        )
    } catch (error) {
        res.send(error)
    }
    
};

// search for a user
module.exports.getSearchingUser = async (req,res) =>{
    let {username,} = req.query;
    try {
        const users = await (await User.find()
        .select("-password")
        .where("username"))
        .includes(username);

        res.status(200).json(users)
    } catch (error) {
        res.send('unable to get users')
    }
    
};

// get a user by id
module.exports.getUserById = (req,res) =>{
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

         User.findOne({_id:id},
        //      (err,docs)=>{
        //     if (!err) {
        //         console.log('loooog1111');
        //         res.status(200).send(docs)
                
        //     } else {
        //         res.status(400).send('Id unknown' + id)
        //     }
        // }
        ).populate("Group").exec(
            (err,docs)=>{
                if (!err) {
                    console.log('loooog1111');
                    res.status(200).send(docs)
                    
                } else {
                    res.status(400).send('Id unknown' + id)
                }
            }
        );

};

// get user by phone
module.exports.getUserByPhone = (req,res) =>{
    const phone = req.params.phone;

    // if (!ObjectId.isValid(id)) {
    //     res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    // }

        User.findOne({phone:phone}, (err,docs)=>{
            if (!err) {
                res.status(200).send(docs)     
            } else {
                res.status(400).send('Id unknown' + id)
            }
        });

};
 
module.exports.updateUser = (req,res) =>{
    console.log('loooog1111');

    const id = req.body.id;

    if (!ObjectId.isValid(id)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }
    try {
    console.log('loooog1111');

         User.findOneAndUpdate(
            
            {_id:id},
            {              
               
                username:req.body.username,
                bio:req.body.bio,
                seeGroups:req.body.seeGroups,
                seeCatalogs:req.body.seeCatalogs,
                seeChannels:req.body.seeChannels,

           
            },
            {new:true,upsert:true, setDefaultsOnInsert:true 
            },
            (err, doc)=>{
                console.log('loooog11((((');

                if (!err) {
                    return res.status(200).send(doc)
                }
                else{
                    res.status(400).send(err)
                }

            }
        
        );
    } catch (err) {
    console.log('looo(--11');

        res.status(400).send(err)
    }
}

// update pass
// module.exports.updatePass =async (req,res) =>{
//     console.log('loooog1111');

//     const id = req.params.id;

//     if (!ObjectId.isValid(id)) {
//         res.status(400).send({"message":"Cet utilisateur n'existe pas"})
//     }
//     try {
//     console.log('loooog1111');
//         // crypt the pass before update
//          //crypt password
//         const salt = await bcrypt.genSalt(10);
//         const hashPass = await bcrypt.hash(req.body.password,salt)

//          User.findOneAndUpdate(
            
//             {_id:id},
//             {                            
//                 password:hashPass,
//             },
//             {new:true,upsert:true, setDefaultsOnInsert:true 
//             },
//             (err, doc)=>{
//                 console.log('loooog11((((');

//                 if (!err) {
//                     return res.status(200).send(doc)
//                 }
//                 else{
//                     res.status(400).json(err)
//                 }

//             }
        
//         );
        

//     } catch (err) {
//     console.log('looo(--11');

//         res.status(400).send(err)
//     }
// }

// DELETE ACCOUNT
module.exports.deleteUser = async (req, res)=>{
    const id = req.params.id;
     User.findOneAndDelete(id, (err,doc)=>{
        if(!err) res.status(200).json({"message":"deleted"});
        else res.send(err)
    })
}

// add a contact
module.exports.addContact = async (req,res)=>{
    id = req.params.id;
    contactPhone = req.body.contactPhone;

    //check the ids
    if (!ObjectId.isValid(id)) {
        res.status(400).send({"message":"Error during procces"})
    }
    // find the phone user

    try {
        // get contact phone user
        const user =await User.findOne(
          {phone:contactPhone}
        );
        if (user) {
            const Cid = user._id;
            // check if the contact is already in adder contact list
            // get who want to add th conctact
            //  and find his contact list
            User.findOne({_id:id},{ contacts: {
                       $elemMatch:{
                        contactId:Cid
                       }
                    } },(err,doc)=>{

                        if(!err){
                            const a = doc.contacts;
                            // console.log(a);

                            if (a.length==0) {
                               
                    console.log("AZERTYUIO");
                    // add who want to add to adding contact list
                    User.findByIdAndUpdate(
                                Cid,
                                {
                                    $addToSet:{
                                        contacts:{
                                            contactId:id,
                                            statu:"Active"
                                        }
                                    }
                                },
                                {new:true,upsert:true,},  
                                  
                            ).exec();
                    User.findByIdAndUpdate(
                            id,
                            {
                                $addToSet:{
                                    contacts:{
                                        contactId:Cid,
                                        statu:"Active"
                                    }
                                }
                            },
                            {new:true,upsert:true,},
                            (err,doc) =>{
                                if (!err) {
                                    res.status(200).send(doc)
                                } else {
                                    res.status(404).send(err)
                                    
                                }
                            }
                    );

                    }else{
                        res.send({"message":"User exist"})
                    }
                    console.log("AZERTYUIO");

                }
            },
                
            )

            
            }
}  catch (error) {
        console.log(error);
    }
}

//remove contact
module.exports.removeContact = async (req,res)=>{
    id = req.params.id;
    contactPhone = req.body.contactPhone;

    //check the ids
    if (!ObjectId.isValid(id)) {
        res.status(400).send({"message":"Error during procces"})
    }
    // find the phone user

    try {
        // get user to remove
        const user =await User.findOne(
          {phone:contactPhone}
        );
        if (user) {
            const Cid = user._id;
            // check if the contact is already in adder contact list
            // get who want to add th conctact
            //  and find his contact list
            User.findOne({_id:id},{ contacts: {
                       $elemMatch:{
                        contactId:Cid
                       }
                    } },(err,doc)=>{

                        if(!err){
                            const a = doc.contacts;
                            // console.log(a);

                            if (a.length !=0) {
                               
                    console.log("AZERTYUIO");
                    // remove from 
                    User.findByIdAndUpdate(
                                Cid,
                                {
                                    $pull:{
                                        contacts:{
                                            contactId:id,
                                            // statu:"Active"
                                        }
                                    }
                                },
                                {new:true,upsert:true,},  
                                  
                            ).exec();
                    User.findByIdAndUpdate(
                            id,
                            {
                                $pull:{
                                    contacts:{
                                        contactId:Cid,
                                        // statu:"Active"
                                    }
                                }
                            },
                            {new:true,upsert:true,},
                            (err,doc) =>{
                                if (!err) {
                                    res.status(200).send(doc)
                                } else {
                                    res.status(404).send(err)
                                    
                                }
                            }
                    );

                    }else{
                        res.send({"message":"User not exist"})
                    }
                    console.log("AZERTYUIO");

                }
            },
                
            )

            
            }
}  catch (error) {
        console.log(error);
    }
}

//block contact

module.exports.blockContact = async (req,res)=>{
    // LES IDS
    id = req.params.id; 
    toBlockId = req.body.toBlockId
    //check the ids
    if (!ObjectId.isValid(id)) {
        res.status(400).send({"message":"User not exist"})
    }
    if (!ObjectId.isValid(req.body.toBlockId)) {
        res.status(400).send({"message":"to block not exist"})
    }

        try {

            // change the statu in who is blocked contact list
             User.updateOne(
                            {_id:toBlockId,'contacts.contactId':id},
                            {$set:{
                                'contacts.$.statu':'Blocked'
                            }},
                            (err,doc)=>{
                                if(!err){
                                    console.log(doc);
                                    // res.status(200).send(doc)
                                }else{
                                    console.log(err);

                                }  
                            } 
                            
                        )
            // change the statu in who want to blocked contact list
            User.updateOne(
                {_id:id,'contacts.contactId':toBlockId},
                {$set:{
                    'contacts.$.statu':'Blocked' 
                }},
                (err,doc)=>{
                    if(!err){
                        console.log("azertyuio");
                       
                       res.status(200).send(doc)
                    }else{
                        res.status(200).send(err)
                    }  
                }
            );

           
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
        
    
    
}

// unblock
module.exports.unblockContact = async (req,res)=>{
    // LES IDS
    id = req.params.id; 
    unBlockId = req.body.unBlockId
    //check the ids
    if (!ObjectId.isValid(id)) {
        res.status(400).send({"message":"User not exist"})
    }
    if (!ObjectId.isValid(req.body.unBlockId)) {
        res.status(400).send({"message":"to block not exist"})
    }

        try {

            // change the statu in who is unblocked contact list
             User.updateOne(
                            {_id:unBlockId,'contacts.contactId':id},
                            {$set:{
                                'contacts.$.statu':'Active'
                            }},
                            (err,doc)=>{
                                if(!err){
                                    console.log(doc);
                                    // res.status(200).send(doc)
                                }else{
                                    console.log(err);

                                }  
                            }
                            
                        )
            // change the statu in who want to unblocked contact list
            User.updateOne(
                {_id:id,'contacts.contactId':unBlockId},
                {$set:{
                    'contacts.$.statu':'Active' 
                }},
                (err,doc)=>{
                    if(!err){
                        console.log("azertyuio");
                       
                       res.status(200).send(doc)
                    }else{
                        res.status(200).send(err)
                    }  
                }
            );

           
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
        
    
    
}

// upload profile img

// add or update profile img
module.exports.userPro = async (req, res) => {
    const id = req.body.id;
    console.log(id);
    console.log(req.file);

    // check file type
    // const filename = req.body.id  + req.file.originalname;
    console.log("dfghjklmù");
    if (req.file!=null) {
        console.log(req.file);
        // update the path in mongodb
        try {
            User.findByIdAndUpdate(
                req.body.id,
                {
                    ProfilePicture:req.file.path
                },
                {new:true,upsert:true},
                (err,doc)=>{
                    if(!err){
                        console.log(doc);
                        res.status(200).send({"imgLink":doc.ProfilePicture})
                    }else{
                        res.status(404).send({"ErrorMessage":"Unable to set image to this group"})
                    }
                }
            )
        } catch (error) {
            console.log(error);
            res.status(404).send({"ErrorMessage":"Fatal Error! Try later"})
        }

    }else{
        console.log("dfghjklmcvbn,;not set");
    }

}