const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
var cors = require('cors');
var ObjectId = require('mongodb').ObjectID;


app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));
let db;
const url = ("mongodb://127.0.0.1:27017/ecommerce");


app.get('/',(req,res)=>{
   res.sendFile(__dirname + '/index.html');
});

app.listen(4000 ,() => {
console.log("listening on 4000");
});


app.post('/createUser' ,function(req,res){
  var name = req.body.name;
  var email= req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;
  
  var data = {
    "name":name,
    "email":email,
    "password": password, 
    "phone" : phone
  }
  
 
  MongoClient.connect(url , function(error , db){
    if (error){
      throw error;
    }
    db.collection('users').findOne({"phone": req.body.phone}, function(err, user) {
            console.log( "err,user",err,user);
            if (err){
                res.json({
                  status: 401,
                  message:'Something went wrong!',
                  err: err
                })
            }
            else if(!err && user === null)
            { 
              db.collection("users").insertOne(data, (err2 , user_doc) => {
                  if(err2)
                  {
                    res.json({
                      status: 400,
                      message:'Something went wrong!',
                      err: err2
                    });
                  }
                  else{
                      res.json({
                        status: 200,
                        message: 'user created successfully!',
                        data:data
                      });
                  }
              });
            }
            else if(!err && user !== null){
                res.json({
                  status: 400,
                  message:'mobile number already existed',

                })
            }
            
    });
  });
  
});



  app.get('/getusers' ,function(req,res){
    
    MongoClient.connect(url , function(error , db){
      if (error){
        throw error;
      }

      db.collection('users').find().toArray((err3,result3) =>{
        if(err3){
          res.json({
            staus:400,
            message:'Something wrong',
            err:err3
          })
        }
        else{
          res.json({
            status:200,
            message:'users data',
            data:result3
          })
        }
      })
    });
  });


  app.post('/deleteUser' ,function(req,res){
    var id = req.body.id;
    var name = req.body.name;
    var email= req.body.email;
    var password = req.body.password;
    var phone = req.body.phone;

    var data = {
      "name":name,  
      "email":email,
      "password": password, 
      "phone" : phone
    }
  
    MongoClient.connect(url , function(error , db){
      if (error){
        throw error;
      }
   
      db.collection('users').findOne({"phone": req.body.phone}, function(err, user) {
        console.log( "err,user",err,user);
          if (err){
                res.json({
                  status: 401,
                  message:'Something went wrong!',
                  err: err
                })
          }
          else 
          { 
              db.collection("users").deleteOne(user, (err2 , user_doc) => {
                res.json({
                          status: 200,
                          message: 'user deleted successfully!',
                          data:user
                });
              });
          }
      });
    });
  });


  app.get('/getdetails',(req,res)=>{
   res.sendFile(__dirname + 'public/view_user.html');
  });


  app.post('/viewUser' ,function(req,res){
    console.log("viewUser");
    var id = req.body._id;
 
    console.log("id of document",id);
   
    MongoClient.connect(url , function(error , db){
      if (error){
        throw error;
      }
  //  db.users.find({'_id': ObjectId('5cc7c4463db2052b44e50e15')}).toArray()
      db.collection('users').find({_id:ObjectId(req.body._id)}).toArray((err4, result4) => {
            console.log("userrrr",id);
            console.log( "err4,result4",err4,result4);
        if (err4 || result4 === null){
                res.json({
                  status: 401,
                  message:'Something went wrong!',
                  err: err4
              })
        }
        else{
                res.json({
                    status: 200,
                    message: 'userdetails',
                    data:result4
                });
            }

           
      });
    });
  });
  




