const User = require("../Models/UserModel");
const ObjectId = require("mongoose").Types.ObjectId;

// const jwt = require("jsonwebtoken");
// const bcrypt = require('bcrypt');
// var validator = require('validator');

// check data
module.exports.CheckData = async(req,res) =>{
    // const checkMail = await User.findOne({email:req.body.email});
    const checkPhone = await User.findOne({phone:req.body.phone});

    

    try {
        if ( checkPhone) 
        return res.status(400).send({NoConnect:"This Mail or Phone Number already is registed"});
        else{
            return res.status(200).send({Connect:"You can connect"});
        }
    } catch (error) {
        return res.status(400).send({ErrorMesssage:"Error while processing"});
    }
}
//register 

module.exports.Register = async (req,res) =>{ 
    console.log('ffgg'); 

    // //check if user already exist
    // const checkName = await User.findOne({name:req.body.username});
    const checkPhone = await User.findOne({ phone: req.body.phone });
    const checkName = await User.findOne({username:req.body.username});
    

    if ( checkPhone || checkName) 
        return res.status(400).send({NoConnect:"This Mail or Phone Number already is registed"});

    const full = req.body.countrycode+req.body.phone;
    const mail = req.body.username.replace(/\s/g,'')
    console.log("zzzzzzzzzzzzzzzzzzzzzz");
    console.log(mail.toLowerCase());



    //create new user
    const user = new User({
        username : req.body.username,
        countrycode : req.body.countrycode,
        phone : req.body.phone,
        email : mail.toLowerCase()+"@wmail.com",
        fullphone : full 

    });

    //sauvegarder le user
    //et renvoyer response
    try{
        //save use
        const savedUser = await user.save();
        return res.status(200).send(
        {
         "UserData":{
             "id":user._id,
             "username":user.username,
             "phone":user.phone,
             "email":user.email,
             "bio":user.bio,
             "catalog":user.catalog,
             "groups":user.groups,
             "channels":user.channels,
             "contacts":user.contacts,
             "countrycode":user.countrycode,
             "fullphone":user.fullphone,


         }
        }
    )
    
    }catch(err){
        res.status(400).send({ServerError:"Error while creating your account"})
        console.log(err)
    }
}

//login

module.exports.Login = async (req, res)=>{

    //check the user existing
    console.log("rrr");

    const user = await User.findOne({email:req.body.email});
       if(!user) return res.status(400).json({message:"This email not exist. please register"}); 

   //verify password
//    const passCheck = await bcrypt.compare( req.body.password,user.password);
//    if(!passCheck) return res.status(400).send("Invalid mot de passe");
   //send true for good login
    res.send(
        {
         "user data":{
             "id":user._id,
             "username":user.username,
             "phone":user.phone,
             "countrycode":user.countrycode,
             "email":user.email, 
             "bio":user.bio,
             "catalog":user.catalog,
             "groups":user.groups,
             "chanels":user.chanels,
         } 
        }
    )
        // const token = jwt.sign({_id:user._id}, "jifkkkdlldllld");
        // res.header("auth-token", token).send({  
        //     "user":user,
        //     "token":token
        // })

   

   
}

// create first rooms

module.exports.createRooms = async (req,res) =>{

    const phoneList =req.body.data["phones"] 
    // const fullPhone =req.body.data["phones"]["number"]

    const Uid = req.body.data["Uid"]
    //check the creator id
    if (!ObjectId.isValid(Uid)) {
        res.status(400).send({"message":"Cet utilisateur n'existe pas"})
    }

    try {
      const promises =[];
      var ExistUsers =[];
      var userList4Update =[];
      // GET THE ACTUAL USER DATA
      for (let index = 0; index < phoneList.length; index++) {
        const fullPhone =phoneList[index]["number"]
        
              console.log(fullPhone);
              // find user by phone
              var userRoom= await User.findOne({fullphone:phoneList[index]["number"]})
      
              console.log(userRoom);
              // if contact phone exist
              // find my doc and put the contact phone inside
              if (userRoom!=null) {
              // console.log("ssssssssssssssssssssssssss");
      
                const me =await User.findById(Uid);
      
                // console.log(me);
                if (me!=null) {
                // console.log(me.contacts);
      
                if(me.contacts.includes(userRoom._id) ){
                  // check if empty
                  console.log("ssssssssssssssssssssssssss");
                   userList4Update.push({
                      "doc":userRoom,
                      "isContact":1 
                      })

                  // if (userList4Update.length ===0) {

                  //   userList4Update.push(userRoom);
                    
                  // } else {
                  //     userList4Update.push(userRoom);

                    // for (let index = 0; index < userList4Update.length; index++) {
                    //   userList4Update.push(userRoom);
                    //   // const element = userList4Update[index];
                    //   // console.log("qqqqqqqqqqqqqqqqq");
  
                    //   // console.log(element["_id"]);
  
                    //   // if (element["_id"]===userRoom._id) {
                    //   // console.log("wwwwwwwwwwwwwwwwwwwwwwwww");
                        
                    //   // } else {
                    //   // console.log("AAAAAAAAAAAAAA");

                    //   // userList4Update.push(userRoom);
                        
                    //   // }
                      
                    // }
                  // }
                  
                
                }else{
                  console.log("pppppppppppppppp");

          // update me contacts
          var updateMe =await User.findByIdAndUpdate(Uid,
            {
              $addToSet:{ 
                contacts:userRoom._id
      
              } 
            },
            {new:true,upsert:true},
          )
          // push data
           ExistUsers.push({
              "doc":userRoom,
              "isContact":1
            })
          // if (ExistUsers.length==0) {
          //   console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
          //   ExistUsers.push({
          //     "doc":userRoom,
          //     "isContact":1
          //   })
          // } else {
          //   for (let index = 0; index < ExistUsers.length; index++) {
          //     ExistUsers.push({
          //         "doc":userRoom,
          //         "isContact":1
          //       })
          //     // const userData = ExistUsers[index];
          //     //   console.log('not push');
          //     // if (userData["doc"]._id===userRoom._id) {
          //     //   console.log('not push');        
          //     // }else{
          //     //   console.log(' push done');
          //     //   ExistUsers.push({
          //     //     "doc":userRoom,
          //     //     "isContact":1
          //     //   })
          //     // }
          //   }
          // }
          console.log(updateMe);
          }} else {}
        }     
      }

      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
      console.log(userList4Update.length);
      console.log(ExistUsers.length);

      return res.status(200).send({"newUsers":ExistUsers,"oldUsers":userList4Update})
         
      
      // RESPONSE
    } catch (error) {
      console.log(error);
      res.status(400).send({"message":"Cet utilisateur n'existe pas"})

      
    }
}

async function createRoomFunc(phoneList,index,Uid) { 
    const fullPhone =phoneList[index]["number"]
    var ExistUsers =[];
    var userList4Update =[];
          console.log(fullPhone);
          // find user by phone
          var userRoom= await User.findOne({fullphone:phoneList[index]["number"]})
  
          console.log(userRoom);
          // if contact phone exist
          // find my doc and put the contact phone inside
          if (userRoom!=null) {
          console.log("ssssssssssssssssssssssssss");
  
            const me =await User.findById(Uid);
          console.log("ssssssssssssssssssssssssss");
  
            console.log(me);
            if (me!=null) {
            console.log(me.contacts);
  
            if(me.contacts.includes(userRoom._id)){
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            userList4Update.push(userRoom);
            console.log(userList4Update);
            }else{
      // update me contacts
      var updateMe =await User.findByIdAndUpdate(Uid,
        {
          $addToSet:{ 
            contacts:userRoom._id
  
          } 
        },
        {new:true,upsert:true},
      )
      // push data
      if (ExistUsers.length==0) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        ExistUsers.push({
          "doc":userRoom,
          "isContact":1
        })
      } else {
        for (let index = 0; index < ExistUsers.length; index++) {
          const userData = ExistUsers[index];
            console.log('not push');
          if (userData["doc"]._id===userRoom._id) {
            console.log('not push');        
          }else{
            console.log(' push done');
            ExistUsers.push({
              "doc":userRoom,
              "isContact":1
            })
          }
        }
      }
      console.log(updateMe);
      }} else {}
    }
      

  
            
  return  {"newUsers":ExistUsers,"oldUsers":userList4Update

}}
