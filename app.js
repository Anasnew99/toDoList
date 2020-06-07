//jshint esversion:6

// Modules Required

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();

// AppSettings

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Databases Creation

mongoose.connect('mongodb://localhost:27017/toDoListDb',{useNewUrlParser:true,useUnifiedTopology:true});
const itemsSchema = mongoose.Schema({items:[String]});
const userSchema = mongoose.Schema({date:Date,itemCount:{type:Number,default:0},items:itemSchema});
const appdb = mongoose.Schema({userEmail:String,noOfDates:{type:Number,default:0},userData:[userSchema]});
const appdbModel = mongoose.model('User',appdb);

// Route Handlers And App Logic

/* Home Routes GET And POSt */
app.get("/", function(req, res) {
  res.render('index')
});
app.post("/", function(req, res){
  userEmail = req.body.userEmail;
    // Logging to that user's Route.
        res.redirect('/'+userEmail);
});


/* User's Route Handler */
app.get("/:userEmail", function(req,res){
  //Checking User in Database.
      appdbModel.find({userEmail:req.params.userEmail},function(err, data){
        if(!err){
          if(!data){ // If User exists
            res.render('date_entry',{data:data});
          }
          else{ //If User doesnot exist creating a new user.
            appdbModel.insertOne({userEmail:req.params.userEmail},function(err,data){
              if(!err){
                console.log("Inserted Successfully");
                res.redirect('/'+req.params.userEmail);
              }
            });
          }
        }
      });
});
app.post("/:userEmail",function(req,res){
  date = req.body.date;
  appdbModel.findOneAndUpdate({userEmail:req.params.userEmail},{$set:{userData[noOfDates].date:date,$inc:{noOfDates:1}},function(err,result){

    if(!err){
      console.log('Successfully Added Date');
      res.redirect('/'+req.params.userEmail);
    }
    else{
      console.log(err);
    }
  });
});

/*  Handling Email & Date Data Routes */

app.get('/:userEmail/:count',function(req,res){
  appdbModel.find({userEmail:req.params.userEmail},function(err,data){
    if(!err){
      if(!data.userData[count]){
        toDoList = data.userData[count].items;
        date = data.userData[count].date;
        res.render('list',{toDoList:toDoList,date:date,userEmail:data.userEmail,count:req.params.count});
      }
      else{
        console.log('No Data Exist');
      }
    }
    else{
      console.log(err);
    }
  });
});

app.post('/:userEmail/:count',function(req,res){
  item = req.body.item;
  appdbModel.findOneAndUpdate({userEmail:req.params.userEmail},{$set:{userData[req.params.count].items[itemCount]:item,$inc:{userData[req.params.count].itemCount:1}}},function(err,result){
    if(!err){
      console.log(result);
    }
    else{
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
