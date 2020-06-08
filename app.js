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
        user.insertMany([{userEmail:userEmail}],function(err,response){
          if(!err){
            if(response){
              console.log("Inserted Successfully"+response[0].userEmail);
              user_id = response[0]._id;
              res.redirect('/user/'+user_id);
            }

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
  if(req.body.datatype==="date"){
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
}
else if(req.body.datatype==="item"){
  item.insertMany([{user_id:req.body.user_id,date_id:req.body.date_id,item:req.body.newItem}],function(err,data){
    if(!err){
      if(data){
        console.log(data);
        res.redirect('/user/'+req.body.user_id+"/"+req.body.date_id);
      }
    }
    else{
      console.log("Error");
    }
  });
}
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
  else if(req.body.datatype ==='item'){
    item.deleteOne({_id:req.body.dataid},function(err,resposnse){
      if(!err){
        console.log("Data succesfully deleted Redirecting....");

        res.redirect('user/'+req.body.user_id+'/'+req.body.date_id);

      }
      else{
        console.log("error");
      }
    });
  }
});

app.get('/user/:user_id/:date_id',function(req,res){
  item.find({user_id:req.params.user_id,date_id:req.params.date_id},function(err,data){
    if(!err){
      listOfItem = [];
      listOfId = [];

      data.forEach(function(item){
        listOfItem.push(item.item);
        listOfId.push(item._id);

      });
      content = {
        list : listOfItem,
        idList: listOfId,
        type:"item",
        user_id:req.params.user_id,
        date_id:req.params.date_id
      }
      res.render('toDoList',{content:content});
      console.log("No Error");
    }
    else{
      console.log("Error");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
