const Ads = require("../Models/adsModel");
const ProductsModel = require("../Models/ProductsModel");

const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer")

const fs = require("fs");
const {promisify, getSystemErrorMap} = require('util');
const { populate } = require("../Models/UserModel");
const UserModel = require("../Models/UserModel");
const pipeline = promisify(require('stream').pipeline)





module.exports.createAd = async (req,res) =>{
    console.log("begin ad creation");
    //check the creator id
    if (!ObjectId.isValid(req.body.ownerId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

    //create the ad
    const Ad = new Ads({
        title:req.body.title,
        description:req.body.description,
        ownerId:req.body.ownerId,
        plan:req.body.plan,
        paymentId:req.body.paymentId,
        planDay:req.body.planDay,



    });

    try {
        //save GROUP
        const savedAd = await Ad.save();
        // send response
        res.status(200).send({Ad:savedAd})
        // logs
        console.log(savedAd);

    
    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}
// find catalogs

module.exports.findAds = async (req,res) =>{ 
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.params.ownerId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }
    try {

        const ads = await Ads.find({ownerId:req.params.ownerId,statu:req.params.statu})
            
        console.log(ads);
        res.status(200).send({AdList:ads})
    
        
     
    } catch (err) {
    console.log("hhhhhhhhhhhhhh");
        
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}

module.exports.acceptAdOrReject = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.params.AdId)) {
        res.status(400).send({"message":"This group not exist"})
    }
 
    try{ 

        //add group id to  user groupList

        Ads.findByIdAndUpdate(
            req.params.AdId,
            {
                statu:req.body.statu,
                startedAt:req.body.startedAt,
                endAt:req.body.endAt

                 
            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {
                console.log(doc);
                return res.status(200).send({
                    success:"You have approuve this add"
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

// get all ads byn statu


module.exports.findAllAds = async (req,res) =>{ 
    console.log("QQ");
    //check the creator id
    
    try {

        const ads = await Ads.find({statu:req.params.statu})
            
        console.log(ads);
        res.status(200).send({AdList:ads})
    
        
     
    } catch (err) {
    console.log("hhhhhhhhhhhhhh");
        
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}
// ADD MEMBER TO GROOP
module.exports.addPartner = async(req,res)=>{
    const CatalogId = req.body.CatalogId
    const PartnersData = req.body.PartnersData

    //check the group id
   if (!ObjectId.isValid(CatalogId)) {
       res.status(400).send({"message":"Catalog not exist"})
   };
   try { 

    const partnersDoc = [];

    for (let index = 0; index < PartnersData.length; index++) {
        console.log(PartnersData[index]);

        if (!ObjectId.isValid(PartnersData[index])) {
            res.status(400).send({"message":"partner not exist"})
        };
        
        console.log(PartnersData[index]);
        // find partner and put cata id in his catalog list
        const newPartners = await User.findByIdAndUpdate(
            PartnersData[index], 
            {
                $addToSet:{
                    catalog: {
                        "id": CatalogId,
                        "isPartner":true
                    }  
                }
            },
            { new: true, upsert: true })
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        
        console.log(newPartners);
        if (newPartners != null) {
            partnersDoc.push(newPartners)
        } 
    //    (err,doc)=>{
    //        if (!err) {
    //         partnersDoc.push(doc)
    //            console.log(partnersDoc);
    //        } else {
    //            console.log(err);
    //        }
    //    }

    //     )
    }
       Catalog.findByIdAndUpdate(
           req.body.CatalogId,
           {
            $addToSet:{
                partners:PartnersData
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                //    get new members doc
                   res.status(200).send({"New partners":partnersDoc})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to add partners in this Catalog"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to add member in this group"})
       
       
   }
}

// delete menber
module.exports.deletePartners = async(req,res)=>{
    console.log("dfghjkl");
    const CatalogId = req.body.CatalogId
    const PartnersIds = req.body.PartnersIds


   //check the group id
   if (!ObjectId.isValid(CatalogId)) {
    res.status(400).send({"message":"Catalog not exist"})
};
   try {
    console.log("dfghjkl");

        for (let index = 0; index < PartnersIds.length; index++) {
            console.log(PartnersIds[index]);

            if (!ObjectId.isValid(PartnersIds[index])) {
                res.status(400).send({"message":"Group not exist"})
            };
            
            console.log(PartnersIds[index]);

            User.findByIdAndUpdate(
                PartnersIds[index], 
                {
                    $pull:{
                        partners:CatalogId
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
        Catalog.findByIdAndUpdate(
           req.body.CatalogId,
           {
            $pullAll:{
                partners:PartnersIds
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                   res.status(200).send({"Success":"Partners  deleted !"})
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

// ADD MEMBER TO GROOP
module.exports.addFollower = async(req,res)=>{
    const CatalogId = req.body.CatalogId
    const FollowersIds = req.body.FollowersIds

    //check the group id
   if (!ObjectId.isValid(CatalogId)) {
       res.status(400).send({"message":"Catalog not exist"})
   };
   try {

    const followersDoc = [];

    for (let index = 0; index < FollowersIds.length; index++) {
        console.log(FollowersIds[index]);

        if (!ObjectId.isValid(FollowersIds[index])) {
            res.status(400).send({"message":"partner not exist"})
        };
        
        console.log(FollowersIds[index]);

        User.findByIdAndUpdate(
            FollowersIds[index], 
            {
                $addToSet:{
                    catalog:CatalogId
                }
            },
       {new:true,upsert:true},
       (err,doc)=>{
           if (!err) {
            followersDoc.push(doc)
               console.log(followersDoc);
           } else {
               console.log(err);
           }
       }

        )
    }
       Catalog.findByIdAndUpdate(
           req.body.CatalogId,
           {
            $addToSet:{
                followers:FollowersIds
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                //    get new members doc
                   res.status(200).send({"New partners":doc.followers})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to add partners in this Catalog"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to add member in this group"})
       
       
   }
}

// delete menber
module.exports.deleteFollower = async(req,res)=>{
    console.log("dfghjkl");
    const CatalogId = req.body.CatalogId
    const FollowersIds = req.body.FollowersIds



   //check the group id
   if (!ObjectId.isValid(CatalogId)) {
    res.status(400).send({"message":"Catalog not exist"})
};
   try {
    console.log("dfghjkl");

        for (let index = 0; index < FollowersIds.length; index++) {
            console.log(FollowersIds[index]);

            if (!ObjectId.isValid(FollowersIds[index])) {
                res.status(400).send({"message":"Group not exist"})
            };
            
            console.log(FollowersIds[index]);

            User.findByIdAndUpdate(
                FollowersIds[index], 
                {
                    $pull:{
                        followers:FollowersIds
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
        Catalog.findByIdAndUpdate(
           req.body.CatalogId,
           {
            $pullAll:{
                followers:FollowersIds
            }
           }, 
           {new:true,upsert:true},
           (err,doc)=>{
                if (!err) {
                   console.log(doc);
                   res.status(200).send({"Success":"Partners  deleted !"})
                  } else {
                      console.log(err);
                   res.status(404).send({"message":"Unable to delete followers in this catalog"})
                   
               }
           }
       );
   } catch (err) {
       console.log(err);
       res.status(404).send({"ErrorMessage":"Unable to delete follower in this catalog"})
       
       
   }
}