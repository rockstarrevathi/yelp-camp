var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");


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
router.post("/",middleware.isLoggedIn,function(req,res){
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
router.get("/new",middleware.isLoggedIn, function(req,res){
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


//Edit campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
         res.render("campgrounds/edit", {campground: foundCampground}); 
    });
});

//Update Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds/" + req.params.id)
      }
   });
   //redirect to show page
   
});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds");
       }
    });
});






module.exports = router;