const Catalog = require("../Models/CatalogModel");
const ProductsModel = require("../Models/ProductsModel");

const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer")

const fs = require("fs");
const {promisify, getSystemErrorMap} = require('util');
const { populate } = require("../Models/UserModel");
const UserModel = require("../Models/UserModel");
const pipeline = promisify(require('stream').pipeline)





module.exports.createCatalog = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.ownerId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

    //create the group
    const newCatalog = new Catalog({
        name:req.body.name,
        description:req.body.description,
        owner:req.body.ownerId,
        isPublic:req.body.isPublic,
        availHours:req.body.availHours,
        catalogLocation:req.body.catalogLocation,


    });

    try {
        //save GROUP
        const savedCatalog = await newCatalog.save();
        //add group id to  user groupList

        User.findByIdAndUpdate(
            req.body.ownerId,
            {
                $addToSet:{
                    catalog: {
                        "id": savedCatalog.id,
                        "isPartner":true
                    }
                } 
            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {
                    console.log('ssdfghjkl');

                    // console.log(doc.contacts);
                    for (let index = 0; index < doc.contacts.length; index++) {
                        User.findByIdAndUpdate(
                            doc.contacts[index],
                            {
                                $addToSet: {
                                    catalog: {
                                        "id": savedCatalog.id,
                                        "isPartner":false
                                    }
                                }
                            }, 
                            {new:true,upsert:true},
                            (err,doc)=>{
                                if (!err) {
                                    console.log("done");
                                    console.log(doc);

                                } else {
                                    console.log(err);
                                }
                            }
                        )
                    }
                    console.log(savedCatalog);

                    return res.status(200).send({catalogData:savedCatalog})
                   
                } else {
                    console.log("hkbjbmvfoijhmoqhboqm");

                    console.log(err);
                    res.status(400).send({error:'Error! Try later'})
                    
                }
            }
        )
    
    }catch(err){
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}
// find catalogs

module.exports.findCatalog = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.params.ownerId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

        console.log("zzzzzzzzzzzzzzzzzzzzzzzzz");



    try {
        var Products = [];
        var PartnersDoc = [];
        var FollowersDoc = [];

        var CatalogDoc =[];
        
        

        console.log("gggggggggggggggggggg");
        // find all one user caalog
        // find all one user caalog

        const catalogs = await Catalog.find().where("owner")
            .equals(req.params.ownerId);
        console.log(catalogs);
        // loop catalog list to get product id list
        for (let index = 0; index < catalogs.length; index++) {
            FollowersDoc = []
            PartnersDoc= []
            FollowersDoc= []
            // e= one catalog doc
            const e = catalogs[index];
            const pro = e["products"]
            // gettong all product data
            for (let index = 0; index < pro.length; index++) {
                const id = pro[index];
                console.log(id);
                var produ = await ProductsModel.findById(id);
                if (produ!=null) {
                    Products.push(produ)
                } else {
                    console.log(produ);
                }
                console.log(Products);
                
            }
            // i hav all product for one catalog
            console.log(Products);
            // let us get all prtners doc
            const partners = e["partners"]
            for (let index = 0; index < partners.length; index++) {
                const id = partners[index];
                console.log(id);
                var partnerData = await UserModel.findById(id);
                if (partnerData!=null) {
                    PartnersDoc.push(partnerData)
                } else {
                    console.log(PartnersDoc);
                }
                console.log(PartnersDoc);
                
            }
            // i have all partners doc
            // let us get all prtners doc
            const followers = e["followers"]
            for (let index = 0; index < followers.length; index++) {
                const id = followers[index];
                console.log(id);
                var followerData = await UserModel.findById(id);
                if (followerData!=null) {
                    FollowersDoc.push(followerData)
                } else {
                    console.log(FollowersDoc);
                }
                console.log(FollowersDoc);
                
            }
            // i have all partners doc
            // now i put all in a object
            const data = {
                "profile": e,
                "products": Products,
                "partners": PartnersDoc,
                "followers":FollowersDoc,
            }
            CatalogDoc.push(data)

        }
        console.log("ffffffffffffffffffffffffffffffffffffffffffff");
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

        

        for (let index = 0; index < CatalogDoc.length; index++) {
            const element = CatalogDoc[index];
            console.log(element["profile"]);
        }
        res.status(200).send({
            "catalogs":CatalogDoc
            // {
            //     "data": catalogs,
            //     "products":Products
            // }
        })
        console.log(CatalogDoc);
     
    } catch (err) {
    console.log("hhhhhhhhhhhhhh");
        
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}

module.exports.findOneCatalog = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.params.catalogId)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }
    try {

        console.log("gggggggggggggggggggg");
        // find all one user caalog
        // find all one user caalog

        const catalogData = await Catalog.findById(req.params.catalogId)
        console.log(catalogData);
       
        console.log("ffffffffffffffffffffffffffffffffffffffffffff");
        
        res.status(200).send({
            "catalog":catalogData
        })
     
    } catch (err) {
    console.log("hhhhhhhhhhhhhh");
        
        res.status(400).send({error:'Error! Try later'})
        console.log(err) 
    }
}

module.exports.updateCatalogProfil = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.catalogId)) {
        res.status(400).send({"message":"This group not exist"})
    }
 
    try{ 

        //add group id to  user groupList

        Catalog.findByIdAndUpdate(
            req.body.catalogId,
            {
                name:req.body.name,
                description:req.body.description,
                catalogLocation:req.body.catalogLocation,
                availHours:req.body.availHours,

            },
            {new:true,upsert:true},
            (err,doc)=>{
                if (!err) {
                console.log(doc);
                return res.status(200).send({
                    newCatalog:{
                        name:doc.name,
                        description:doc.description,
                        catalogLocation:doc.catalogLocation,
                        availHours:doc.availHours
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