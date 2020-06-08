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
const itemsSchema = mongoose.Schema({
  user_id:String,
  date_id:String,
  item:String
});
const item = mongoose.model("Item",itemsSchema);
const dateSchema = mongoose.Schema({
  user_id:String,
  date:Date
});
const userDate = mongoose.model("Date",dateSchema);
const userSchema = mongoose.Schema({
  userEmail:String
});
const user = mongoose.model("User",userSchema);
// Route Handlers And App Logic

/* Home Routes GET And POSt */
app.get("/", function(req, res) {
  res.render('index')
});
app.post("/", function(req, res){
  userEmail = req.body.userEmail;
  var user_id = 0;
  user.findOne({userEmail:userEmail},function(err,data){
    if(!err){
      if(!data){
        user.insertMany([{userEmail:userEmail}],function(err,data){
          if(!err){
            console.log("Inserted Successfully"+data.userEmail);
            user_id = data._id;
            res.redirect('/user/'+user_id);
          }else{
            console.log("Error");
          }
        });
      }
      else{
        user_id=data._id;
        console.log(data._id);
        res.redirect('/user/'+user_id);
      }
    }
    else{
      console.log("Error");
    }
  });
      // Logging to that user's Route.

});


/* User's Route Handler */
app.get("/user/:user_id", function(req,res){
  //Checking User in Database.
    userDate.find({user_id:req.params.user_id},function(err,data){
      if(!err){
        listOfDate = [];
        listOfId = [];
        forwardLink = [];
        data.forEach(function(date){
          listOfDate.push(date.date);
          listOfId.push(date._id);
          forwardLink.push("/user/"+req.params.user_id+"/"+date._id);
        });
        content = {
          title:"List of Your Dates",
          list : listOfDate,
          idList: listOfId,
          type:"date",
          user_id:req.params.user_id,
          forwardLink:forwardLink
        }
        res.render('list',{content:content});
        console.log("No Error");
      }
      else{
        console.log("Error");
      }
    });
});

app.post('/create',function(req,res){
  userDate.insertMany([{user_id:req.body.user_id,date:req.body.newItem}],function(err,data){
    if(!err){
      if(data){
        console.log(data);
        res.redirect('/user/'+req.body.user_id);
      }
    }
    else{
      console.log("error");
    }
  });
});

app.post('/delete',function(req,res){
  if(req.body.datatype==='date'){
    userDate.deleteOne({_id:req.body.dataid},function(err,response){
      if(!err){
        console.log("Data scuccefully deleted Redirecting....");
        if(response){res.redirect('user/'+req.body.user_id);}
        else{console.log("No data found");}
      }
      else{
        console.log("error");
      }
    });
  }
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
