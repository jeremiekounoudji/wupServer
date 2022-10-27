const express = require("express");
const User = require("./Models/UserModel");

// cors
var cors = require('cors');
// connect to db
require('./configs/db')

// create server
const app = express(); 
const server = require('http').createServer(app);

// the socket setup

const io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// BODY PARSER
app.use(express.json());
app.use(express.static(`${__dirname}/Media`))  
app.use(express.static(`${__dirname}/Media/catalog/products`))  
app.use(express.static(`${__dirname}/Media/catalog/profils`))  
app.use(express.static(`${__dirname}/Media/images/profiles`))
app.use(express.static(`${__dirname}/Media/audios`)) 
app.use(express.static(`${__dirname}/Media/mails`)) 

app.use(express.static(`${__dirname}/Media/ads`)) 

app.use(express.static(`${__dirname}/Media/videos`)) 

app.use(express.static(`${__dirname}/Media/others`))  


app.use(express.static(`${__dirname}/Media/docs`))  




// import routes
const authRoute = require("./Routes/AuthRoutes"); 
const userRoute= require("./Routes/UserRoutes");
const groupRoute= require("./Routes/GroupRoutes");
const channelRoute= require("./Routes/ChannelRoutes");
const catalogRoute= require("./Routes/catalogRoute");
const productRoute= require("./Routes/ProductRoute");
const adRoute= require("./Routes/adRoutes");
const mailRoomRoute= require("./Routes/mailRoomRoute");
const mailRoute= require("./Routes/mailRoute");
const { log } = require("console");
const GroupModel = require("./Models/GroupModel");
const { Socket } = require("dgram");





// route middleware
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/groups",groupRoute); 
app.use("/api/v1/channels",channelRoute); 
app.use("/api/v1/catalog",catalogRoute); 
app.use("/api/v1/products",productRoute); 
app.use("/api/v1/ads",adRoute); 
app.use("/api/v1/mail-room",mailRoomRoute); 
app.use("/api/v1/mail",mailRoute); 







 
// socket begin

var clients = {}

io.on('connection',(socket) => {
  console.log('Connected...', socket.id);

    //listens for connection to set connection statu
    socket.on('login',(id) => {
      console.log('login'+id);
      clients[id] = socket;
      // console.log(clients);
    })
    // build the client object
  
  //listens for new messages coming in
    socket.on('send-message',(msgData) => {
      console.log(msgData);
      const targetId = msgData.roomId
      if( clients[targetId]){
        clients[targetId].emit('receive-message',msgData)

      }else{
        console.log('not online');
      }
    })    
    // listen join group
    socket.on("join-groups",(groupList) =>{
      console.log("join group");
      console.log(groupList);
      for (const id in groupList) {
       console.log(groupList[id]);
       socket.join(groupList[id])
       console.log(socket.rooms);
      }
    })
    socket.on("join-one-group",(groupId) =>{
      console.log("join group");

       socket.join(groupId)
       socket.join(groupId)
       socket.join(groupId)

      console.log(Socket.rooms);
    
    })
    
    socket.on("new-group",(data) =>{
      console.log("groups data");
      console.log(clients);

      // console.log(data);
      const membersList = data["groupData"]["members"]
      membersList.forEach(id => {
        console.log(id);
        if( clients[id]){
          console.log(' online');
          if (id==data["creatorId"]) {
            console.log(' dddddd');
            
          } else {
             clients[id].emit('receive-new-group',data)
            console.log(' bbbbbbbbbbbbbbbbbbbbbb');
            console.log(data);
          }

         

  
        }else{
          console.log('not online');
        }
      });
    })

    // on update group info
    socket.on("update-group-data",(data) =>{
      console.log("groups data");
      console.log(clients);
      console.log(data);
      const membIds = data["membersIds"];

      // update the group
     
      membIds.forEach(id =>{
        if( clients[id]){
          console.log(' online');

          clients[id].emit('receive-update-group-data',{
            "newVals":data["newValues"],
            "oldVals":data["oldVals"],
            "img":data["img"]

          })
          console.log(' bbbbbbbbbbbbbbbbbbbbbb');
  
        }else{
          console.log('not online');
        }
      })
    })

    // on group profile send
     // on update group info
     socket.on("update-group-profile",(data) =>{
      // console.log(clients);
      console.log(data["groupId"]);
      // const membIds = data["img"];
      // emit in groop
      socket.join(data["groupId"])
      socket.to(data["groupId"]).emit('receive-update-group-profile', data);
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");

    })

    // update group mem role
    socket.on("update-group-member-role",(data) =>{
      // console.log(clients);
      // console.log(data);
      // const membIds = data["img"];
      // emit in groop
      socket.join(data["groupId"])
      socket.to(data["groupId"]).emit('receive-update-group-member-role', data);
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");
      // console.log(socket.join(data["groupId"]));

    })
    // DELETE GROUP MEMBER
    // update group mem role
    socket.on("delete-group-member",(data) =>{
      // console.log(clients);
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");

      console.log(data);
      // const membIds = data["img"];
      // emit in groop
      io.join(data["groupId"])
      io.to(data["groupId"]).emit('receive-delete-group-member', data);
      console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");
      // console.log(socket.join(data["groupId"]));

    })

    // update group mem role
    socket.on("add-new-group-members",(data) =>{
      console.log(clients);
      console.log(data);
      // emit data to new member
      for (let index = 0; index < data['newMembersRoom'].length; index++) {
        const newMember = data['newMembersRoom'][index];
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzz");
        console.log(newMember);

        socket.to(newMember["key"]).emit('receive-add-new-group-members', data);
      }

    })
    // listen group message send
    socket.on('send-group-message',(msgData) => {

      console.log(msgData);
      const groupId = msgData['groupId']
      socket.join(groupId)

      console.log("zzzzzzzzzzzzzzzzzzzzz");
      console.log(socket.rooms);
      // socket.rooms.emit('receive-group-message', 'cool game')
      // socket.in("room1").emit('receive-group-message', 'cool game');
      io.to(groupId).emit("receive-group-message",msgData)
      console.log("zzzzzzzzzzzzzzzzzzzzz");

    })   
    // delete msg even
    socket.on("delete-msg", (msgTodelete)=>{
      // const targetId  = '623fdfa85cf1599dd89bc4ce'
      const targetId = msgTodelete.senderId
      console.log("msgTodelete");
      console.log(msgTodelete);
      // socket.emit('delete-msg',msgTodelete)

      if( clients[targetId]){
        clients[targetId].emit('delete-msg',msgTodelete)

      }else{
        console.log('not online');
      }
    })

    // send audio
    socket.on("send-audio", async (data) =>{
      console.log(data);
    })

    // DELETE AND LEAVE GROUP
    socket.on("member-leave-group", async (data) =>{
      console.log("leave group even")

        console.log(data)
        // leave room,
        socket.leave(data["groupId"])
        // delete member from group member

        // send receive member leave group to every body
    })

    // listen create room even 
    socket.on("create-rooms",async (data) => {

      const phoneList =data["phones"]
      const fullPhone =data["phones"]["number"]

      const Uid = data["Uid"]
 
      // console.log(phoneList);
      // itterate the list
      try {

        var ExistUsers =[];
        var userList4Update =[];
        // GET THE ACTUAL USER DATA
        for (let index = 0; index < phoneList.length; index++) {
          const fullPhone =phoneList[index]["number"]

          console.log(fullPhone);
          // find user by phone
          var userRoom= await User.findOne({fullphone:fullPhone})
          console.log(userRoom);
          // if contact phone exist
          // find my doc and put the contact phone inside
          if (userRoom!=null) {
            const me =await User.findById(Uid);
            console.log(me);
            if (me!=null) {
              // update me contacts
              var updateMe =await User.findByIdAndUpdate(
                Uid,
                {
                  $addToSet:{ 
                    contacts:userRoom._id

                  } 
                },
                {new:true,upsert:true},
              )
              // push data
              ExistUsers.push(
                {
                  "doc":userRoom,
                  "isContact":1
                }
              )
              console.log("updateMe");

              console.log(updateMe);
            } else {
              
            }
          }
         
        }
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
        console.log(ExistUsers);
        socket.emit("send-rooms",ExistUsers);

      } catch (error) {
        console.log(error);
        
      }
      
    }
  )

    
  
  //listens when a user is disconnected from the server
  socket.on('disconnect', function () {
      console.log('Disconnected...', socket.id);
      const lastSeen = Date.now()
      // console.log(lastSeen);
      // socket.emit("last-seen",{
      //   "uid":clients[id] ,
      //   "last-seen":lastSeen
      // })

    })
  
  //listens when there's an error detected and logs the error on the console
  socket.on('error', function (err) {
      console.log('Error detected', socket.id);
      console.log(err);
    })
  })

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => { 
            console.log(`listening on port ${PORT}`);  
});