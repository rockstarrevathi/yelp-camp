var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// =============================================
//              COMMENTS ROUTES
// =============================================
//Comments New
 router.get("/new",isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err,campground){
       if(err){
           console.log(err);
       } else{
            res.render("comments/new.ejs", {campground: campground});
       }
    });
});

//Comments Create
 router.post("/",isLoggedIn, function(req,res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else{
             //create new comment
            Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else{
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save the comment
                comment.save();
                   //connect new comment to campground
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                   //redirectto campground show page
                res.redirect('/campgrounds/'+ campground._id);
                }
         });
      }
   });
});


module.exports = router;

//==============middleware==========
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}