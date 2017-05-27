var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

//INDEX - show all campgrounds
router.get("/",function(req,res){
    //Get all campgrounds fron DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index.ejs",{campgrounds: allCampgrounds});

        }
    });
});
// CREATE - Add new campground to db
router.post("/",isLoggedIn,function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author= {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, image: image, description:description, author: author};
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
router.get("/new",isLoggedIn, function(req,res){
   res.render("campgrounds/new.ejs"); 
});
//SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show.ejs",{campground: foundCampground});
        }
    });
});

//==============middleware==========
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;