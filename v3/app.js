var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds.js");
var seedDB = require("./seeds.js");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
   res.render("landing.ejs"); 
});
//INDEX - show all campgrounds
app.get("/campgrounds",function(req,res){
    //Get all campgrounds fron DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index.ejs",{campgrounds: allCampgrounds});

        }
    });
});
// CREATE - Add new campground to db
app.post("/campgrounds",function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var newCampground = {name: name, image: image, description:description};
   //create a new campground and save to db
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
        //redirect back to the campgrounds page
           res.redirect("/campgrounds");
       }
   });
});
//NEW - show form to create new campground
app.get("/campgrounds/new", function(req,res){
   res.render("new.ejs"); 
});
//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("show.ejs",{campground: foundCampground});
        }
    });
});





app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The yelpcamp has started"); 
});