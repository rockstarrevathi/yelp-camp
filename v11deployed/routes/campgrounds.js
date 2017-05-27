var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require("geocoder");





//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});


// CREATE - Add new campground to db
router.post("/",middleware.isLoggedIn,function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var description = req.body.description;
   var author= {
       id: req.user._id,
       username: req.user.username
   }
    var price = req.body.price;
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
   var newCampground = {name: name, price:price,image: image, description:description, author: author, location: location, lat: lat, lng: lng};
   //create a new campground and save to db
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
        //redirect back to the campgrounds page
            console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   });
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
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
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