const Catalog = require("../Models/CatalogModel");
const Product = require("../Models/ProductsModel");

const User = require("../Models/UserModel")
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer")

const fs = require("fs");
const {promisify} = require('util');
const { populate } = require("../Models/UserModel");
const pipeline = promisify(require('stream').pipeline)

module.exports.createProduct = async (req,res) =>{
    console.log("QQ");
    //check the creator id
    if (!ObjectId.isValid(req.body.catalogId)) {
        res.status(400).send({"message":"This Catalog not exist"})
    }
    console.log("vvvvvQQ");

    //create the group
    const product = new Product({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        isAvailable:req.body.isAvailable,
        catalogId:req.body.catalogId

    });
    console.log("hhhhhhhhhhQQ");

    try{
        //save product
    console.log("hhhhhhhhhhQQ");

        const savedProduct = await product.save();
    console.log("5555555555555555555555555555");

        Catalog.findByIdAndUpdate(
            req.body.catalogId,
            {
                $addToSet:{
                    products:savedProduct.id
                }
            },
            {new:true,upsert:true},
            (err,doc)=> {
    console.log("kkkkkkkkkkkkkQQ");

                if (!err) {
                    console.log("menber side doc");
                    Product.findById(
                        savedProduct.id,(err,doc)=>{
                            if (!err) {
                                res.status(200).send({product:doc})
                                console.log(doc);
                            }else{
                                res.status(400).send({Error:"Error Try lqter"})
                                console.log(err);

                            }
                       }
                )

                    // console.log(membersDoc);
                } else {
                    console.log("menber side err");
                     res.status(400).send({Error:"Error Try lqter"})

                    console.log(err);
                } 
            }
        ) 
         

         
        
    
    }catch(err){
        res.status(400).send({Error:"Error Try later"})
        console.log(err) 
    }
}

module.exports.updateProductProfil = async (req,res) =>{
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    //check the creator id
    if (!ObjectId.isValid(req.body.productId)) {
        res.status(400).send({"message":"This Product not exist"})
    }


    try{
        //save productupdate product
        Product.findByIdAndUpdate(
            req.body.productId,
            {
                
                    name:req.body.name,
                    description:req.body.description,
                    price:req.body.price,
                    isAvailable:req.body.isAvailable,
            
                
            },
            {new:true,upsert:true},
            (err,doc)=> {

                if (!err) {
                    console.log("menber side doc");
                    Product.findById(
                        req.body.productId,(err,doc)=>{
                             if (!err) {
                                 res.status(200).send({product:doc})
                                 
                             }else{
                                 res.status(400).send({Error:"Error Try lqter"})
                                 console.log(err);
 
                             }
                        }
                 )
                //    const p= await Product.findById(savedGroup.id)
                //    res.status(200).send({product:p})
                    // console.log(membersDoc);
                } else {
                    console.log("menber side err");
                     res.status(400).send({Error:"Error Try lqter"})

                    console.log(err);
                }
            }
        )
        

        
        
    
    }catch(err){
        res.status(400).send({Error:"Error Try later"})
        console.log(err) 
    }
}

// delete product
module.exports.deleteProduct = async (req,res) =>{
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    //check the creator id
    if (!ObjectId.isValid(req.params.productId)) {
        res.status(400).send({"message":"This Product not exist"})
    }


    try{
        //save productupdate product
        Product.findByIdAndDelete(
            req.params.productId,
            (err,doc)=> {

                if (!err) {
                    console.log("menber side doc");
                    res.status(200).send({Sucess:"Product deleted"})
              
                } else {
                    console.log("menber side err");
                     res.status(400).send({Error:"Error Try later"})

                    console.log(err);
                }
            }
        )
        

        
        66
    
    }catch(err){
        res.status(400).send({Error:"Error Try later"})
        console.log(err) 
    }
}