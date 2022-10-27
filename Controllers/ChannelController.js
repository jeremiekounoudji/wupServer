const Channel = require("../Models/ChannelsModel");
const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer")

const fs = require("fs");
const {promisify} = require('util');
const { populate } = require("../Models/UserModel");
const pipeline = promisify(require('stream').pipeline)




module.exports.createChannel = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.ownerId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

    //create the group
    const newChannel = new Channel({
        name:req.body.name,
        description:req.body.description,
        owner:req.body.ownerId,
        isPublic:req.body.isPublic,

        members:req.body.members,
        admins:req.body.admins

    });

    try{
        //save GROUP
        const savedChannel = await newChannel.save();
        //add group id to  user groupList
        const membersDoc =[];
        savedChannel.members.forEach(member => {
            // console.log(member);
            User.findByIdAndUpdate(
                member,
                {
                    $addToSet:{
                        channels:savedChannel.id
                    }
                },
                {new:true,upsert:true},
                (err,doc)=>{

                    if (!err) {
                        console.log("menber side doc");
                        membersDoc.push(doc)
                        // console.log(membersDoc);
                    } else {
                        console.log("menber side err");

                        console.log(err);
                    }
                }
            )
           
        });
        const channel = await Channel.findById(savedChannel.id)
        User.findByIdAndUpdate(
            req.body.ownerId,
            {
                $addToSet:{
                    channel:savedChannel.id
                }
            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {

                    // console.log(savedGroup.members);
                    return res.status(201).send({
                        channelData:channel,
                        allMembersDoc:membersDoc
                    })
                } else {
                    console.log(err);
                    res.status(400).send({error:'Error! Try later'})
                    
                    
                }
               
            }
        )

        
        
    
    }catch(err){
        res.status(400).send(err)
        console.log(err) 
    }
}


// add members
module.exports.addMember = async(req,res)=>{
    const ChannelId = req.body.ChannelId
    const MemberIds = req.body.MemberIds

    //check the group id
   if (!ObjectId.isValid(ChannelId)) {
       res.status(400).send({"message":"Group not exist"})
   };
   try {

    for (let index = 0; index < MemberIds.length; index++) {
        console.log(MemberIds[index]);

        if (!ObjectId.isValid(MemberIds[index])) {
            res.status(400).send({"message":"Group not exist"})
        };
        
        console.log(MemberIds[index]);

        User.findByIdAndUpdate(
            MemberIds[index], 
            {
                $addToSet:{
                    channels:ChannelId
                }
            },
       {new:true,upsert:true},
       (err,doc)=>{
           if (!err) {
               console.log(doc);
           } else {
               console.log(err);
           }
       }

        )
    }
       Channel.findByIdAndUpdate(
           req.body.ChannelId,
           {
            $addToSet:{
                members:MemberIds
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                   res.status(200).send({"UpdatedMembers":doc})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to add member in this group"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to add member in this group"})
       
       
   }
}


//find channel by id

module.exports.findChannelById = (req,res)=>{
    //check the creator id
    if (!ObjectId.isValid(req.body.ChannelId)) {
        res.status(400).send({"message":"Group not exist"})
    };

    try {
        Channel.findById(
            req.body.ChannelId,
             (err,doc)=>{
                if (!err) {
                   return res.status(200).send({"channelData":doc})
                   } else {
                    console.log("fjjjh");

                       console.log(err);

                   return res.status(400).send({"message":"Unable to find this channel"})
                    
                }
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(400).send({"message":"Unable to find this group"})
        
    }
}

module.exports.deleteMember = async(req,res)=>{
    console.log("dfghjkl");
    const ChannelId = req.body.ChannelId 
    const MemberIds = req.body.MemberIds
 
    //check the group id
    console.log("dfghjkl");

   if (!ObjectId.isValid(ChannelId)) { 
       res.status(400).send({"message":"channel not exist"})
   };
   try {
    console.log("dfghjkl");

        for (let index = 0; index < MemberIds.length; index++) {
            console.log(MemberIds[index]);

            if (!ObjectId.isValid(MemberIds[index])) {
                res.status(400).send({"message":"this user not exist"})
            };
            
            console.log(MemberIds[index]);

            User.findByIdAndUpdate(
                MemberIds[index], 
                {
                    $pull:{
                        channels:ChannelId
                    }
                },
           {new:true,upsert:true},
           (err,doc)=>{
               if (!err) {
                   console.log(doc);
               } else {
                   console.log(err);
               }
           }

            )
        }
        
        // delete from th chaanell
       Channel.findByIdAndUpdate(
           req.body.ChannelId,
           {
            $pullAll:{
                members:MemberIds
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                   res.status(200).send({"UpdatedMembers":doc})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to delete member in this group"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to delete member in this group"})
       
       
   }
}

// ADD ADMIN
module.exports.addAdmin = async(req,res)=>{
    const ChannelId = req.body.ChannelId;
    const AdminIds = req.body.AdminIds;

    //check the group id
   if (!ObjectId.isValid(ChannelId) && !ObjectId.isValid(AdminIds)) {
       res.status(400).send({"message":"Fata error!"})
   }else{
       console.log("azertyuio");
   };
   try {

       Channel.findByIdAndUpdate(
           req.body.ChannelId,
           {
            $addToSet:{
                admins:AdminIds
            }
           },
           {new:true,upsert:true},

           (err,doc)=>{
                if (!err) {
                //    add the menber id
                // doc.groups.$addToSet:
                   console.log(doc);
                   res.status(200).send({"UpdatedAdmin":doc.admins})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to add member in this group"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to add member in this group"})
       
       
   }
}


// delete ADMIN
module.exports.deleteAdmin = async(req,res)=>{
    const ChannelId = req.body.ChannelId;
    const AdminIds = req.body.AdminIds;

    //check the group id
   if (!ObjectId.isValid(ChannelId) && !ObjectId.isValid(AdminIds)) {
       res.status(400).send({"message":"Fata error!"})
   };
   try {

       Channel.findByIdAndUpdate(
           req.body.ChannelId,
           {
            $pullAll:{
                admins:AdminIds
            }
           },
           {new:true,upsert:true},

           (err,doc)=>{
                if (!err) {
                //    add the menber id
                // doc.groups.$addToSet:
                   console.log(doc);
                   res.status(200).send({"NewAdmins":doc.admins})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to delete  this admin  in this group"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to add member in this group"})
       
       
   }
}


module.exports.updateChannelProfil = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.ChannelId)) {
        res.status(400).send({"message":"This group not exist"})
    }
 
    try{ 

        //add group id to  user groupList

        Channel.findByIdAndUpdate(
            req.body.ChannelId,
            {
                name:req.body.name,
                 description:req.body.description,
            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {
                console.log(doc);
                return res.status(201).send({
                    newChannel:{name:doc.name,description:doc.description}
                })
                    
                
                } else {
                    console.log(err);
                    res.status(400).send({error:'Error! Try later'})
                    
                }
            }
        )
    
    }catch(err){
        console.log(err)
        res.status(400).send({error:'Fatal Error! Try later'})

        
    }
}

// add or update profile img
module.exports.channelImageProfile = async (req, res) => {
    // const id = req.params.id;
    // check file type
    const filename = req.body.ChannelId + "--" + req.file.originalname;

    console.log("dfghjklmù");
    if (req.file!=null) {
       
       
        // update the path in mongodb
        try {
            Channel.findByIdAndUpdate(
                req.body.ChannelId,
                {
                    imgProfil:`./Media/WhatUpImages/ProfileImage/MyProfileImage/${filename}`
                },
                {new:true,upsert:true},
                (err,doc)=>{
                    if(!err){
                        console.log(doc);
                        res.status(200).send({"imgLink":doc.imgProfil})
                    }else{
                        res.status(404).send({"ErrorMessage":"Unable to set image to this group"})
                    }
                }
            )
        } catch (error) {
            console.log(error);
            res.status(404).send({"ErrorMessage":"Fatal Error! Try later"})
        }

    }

    
    // put it on local folder

        
        

}

