var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
 //is user logged in
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                 if(err){
                    res.redirect("/campgrounds");
                } else{
                     //does user own the campground??
                     if(foundCampground.author.id .equals(req.user._id)){
                        next();
                     }else{
                         res.redirect("back");
                     }
            }
         });
            
        }else{
            res.redirect("back");
        }
    
}
    

middlewareObj.checkCampgroundOwnership = function checkCommentOwnership(req,res,next){
 //is user logged in
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                 if(err){
                    res.redirect("/campgrounds");
                } else{
                     //does user own the comment??
                     if(foundComment.author.id .equals(req.user._id)){
                        next();
                     }else{
                         res.redirect("back");
                     }
            }
         });
            
        }else{
            res.redirect("back");
        }
    
}



middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;