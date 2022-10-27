const Group = require("../Models/GroupModel");
const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer")

const fs = require("fs");
const {promisify} = require('util');
const { populate } = require("../Models/UserModel");
const pipeline = promisify(require('stream').pipeline)

module.exports.createGroup = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.ownerId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

    //create the group
    const newGroup = new Group({
        name:req.body.name,
        description:req.body.description,
        owner:req.body.ownerId,
        members:req.body.members,
        admins:req.body.admins

    });

    try{
        //save GROUP
        const savedGroup = await newGroup.save();
        //add group id to  user groupList
        const membersDoc =[];
        savedGroup.members.forEach(member => {
            // console.log(member);
            User.findByIdAndUpdate(
                member,
                {
                    $addToSet:{
                        groups:savedGroup.id
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
        const group = await Group.findById(savedGroup.id)
        User.findByIdAndUpdate(
            req.body.ownerId,
            {
                $addToSet:{
                    groups:savedGroup.id
                }
            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {

                    // console.log(savedGroup.members);
                    return res.status(201).send({
                        groupData:group,
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

module.exports.updateGroupProfil = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.GroupId)) {
        res.status(400).send({"message":"This group not exist"})
    }
 
    try{

        //add group id to  user groupList

        Group.findByIdAndUpdate(
            req.body.GroupId,
            {
                name:req.body.name,
                 description:req.body.description,
            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {
                console.log(doc);
                return res.status(201).send({
                    newGroup:{
                        id:doc._id,
                        name:doc.name,
                        description:doc.description
                    }
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

//find group by id

module.exports.getGroup = (req,res)=>{
    //check the creator id
    if (!ObjectId.isValid(req.body.GroupId)) {
        res.status(400).send({"message":"Group not exist"})
    };

    try {
        Group.findById(
            req.body.GroupId,
             (err,doc)=>{
                if (!err) {
                    res.status(200).send({"groupData":doc})
                   } else {
                       console.log(err);
                    res.status(400).send({"message":"Unable to find this group"})
                    
                }
            }
        )
    } catch (err) {
        console.log(err);
        res.status(400).send({"message":"Unable to find this group"})
        
    }
}


// leabe group

//delete group

module.exports.deleteGroup = async(req,res)=>{
     //check the group id
    if (!ObjectId.isValid(req.body.GroupId)) {
        res.status(400).send({"message":"Group not exist"})
    };
    

    try {
        // pull group id from all menbers groop list
         Group.findById(
            req.body.GroupId,
            (err,doc)=>{
                if (!err) {
                    const Members = doc.members;
                    console.log(Members);
                    Members.forEach((m)=>{
                        console.log(m);
                        User.findByIdAndUpdate(
                            m,
                            {
                                $pull:{
                                    groups:req.body.GroupId
                                }
                            }
                        )
                    })
                }
            }
        )

        // delete the grpop
        Group.findByIdAndDelete(
            req.body.GroupId,
            (err,doc)=>{
                 if (!err) {
                    
                    console.log(doc);
                    return res.status(200).send({"message":"The group is succesfully deleted"})
                   } else {
                       console.log(err);
                    return res.status(404).send({"message":"Unable to delete this group"})
                    
                }
            }
        );
        
         
    } catch (err) {
        console.log(err);
        return res.status(400).send({"ErrorMessage":"Unable to delete this group"})
        
    }
}

// ADD MEMBER TO GROOP
module.exports.addMember = async(req,res)=>{

    const GroupId = req.body.GroupId
    const MemberIds = req.body.MemberIds
    console.log(MemberIds);

    //check the group id
   if (!ObjectId.isValid(GroupId)) {
       res.status(400).send({"message":"Group not exist"})
   };
   try {

    const newMemberDoc = [];

    for (let index = 0; index < MemberIds.length; index++) {
        console.log(MemberIds[index]['key']);

        if (!ObjectId.isValid(MemberIds[index]['key'])) {
            res.status(400).send({"message":"Group not exist"})
        };
        
        console.log(MemberIds[index]['key']);

        User.findByIdAndUpdate(
            MemberIds[index]['key'], 
            {
                $addToSet:{
                    groups:GroupId
                }
            },
       {new:true,upsert:true},
       (err,doc)=>{
           if (!err) {
            newMemberDoc.push(doc)
            console.log("ddddddddddddddddddddddddd");

            //    console.log(newMemberDoc);
           } else {
               console.log(err);
           }
       }

        )
    }
       Group.findByIdAndUpdate(
           req.body.GroupId,
           {
            $addToSet:{
                members:MemberIds['key']
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                //    console.log(doc);
                //    get new members doc
                   res.status(200).send({"UpdatedMembers":newMemberDoc})
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

// delete menber
module.exports.deleteMember = async(req,res)=>{
    console.log("dfghjkl");
    const GroupId = req.body.GroupId
    const MemberIds = req.body.MemberIds

    //check the group id
    console.log("dfghjkl");

   if (!ObjectId.isValid(GroupId)) { 
       res.status(400).send({"message":"Group not exist"})
   };
   try {
    console.log("dfghjkl");

        for (let index = 0; index < MemberIds.length; index++) {
            console.log(MemberIds[index]);

            if (!ObjectId.isValid(MemberIds[index])) {
                res.status(400).send({"message":"Group not exist"})
            };
            
            console.log(MemberIds[index]);

            User.findByIdAndUpdate(
                MemberIds[index], 
                {
                    $pull:{
                        groups:GroupId
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
        
        // delete from th group
       Group.findByIdAndUpdate(
           req.body.GroupId,
           {
            $pullAll:{
                members:MemberIds
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                   res.status(200).send({"Success":"Members  deleted !"})
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
    const GroupId = req.body.GroupId;
    const AdminIds = req.body.AdminIds;

    //check the group id
   if (!ObjectId.isValid(GroupId) && !ObjectId.isValid(AdminIds)) {
       res.status(400).send({"message":"Fata error!"})
   }else{
       console.log("azertyuio");
   }; 
   try {

       Group.findByIdAndUpdate(
           req.body.GroupId,
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
    const GroupId = req.body.GroupId;
    const AdminIds = req.body.AdminIds;

    //check the group id
   if (!ObjectId.isValid(GroupId) && !ObjectId.isValid(AdminIds)) {
       return res.status(400).send({"message":"Fata error!"})
   };
   try {

       Group.findByIdAndUpdate(
           req.body.GroupId,
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
                   return res.status(404).send({"message":"Unable to delete  this admin  in this group"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to add member in this group"})
       
       
   }
}

// add or update profile img
module.exports.groupImageProfile = async (req, res) => {
    // const id = req.params.id;
    // check file type
    console.log("dfghjklmù");
    if (req.file!=null) {
    console.log("cccccccccccccccccccc");

        console.log(req.file);
        // update the path in mongodb
        try {
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

            Group.findByIdAndUpdate(
                req.body.GroupId,
                {
                    imgProfil:req.file.path
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
