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
                        req.flash("error", "You don't have permission to do that");
                         res.redirect("back");
                     }
            }
         });
            
        }else{
            res.redirect("back");
            req.flash("error", "You need to be logged in to do that");
        }
    
}
    

middlewareObj.checkCampgroundOwnership = function checkCommentOwnership(req,res,next){
 //is user logged in
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                 if(err){
                     req.flash("error", "Campground not found");
                    res.redirect("/campgrounds");
                } else{
                     //does user own the comment??
                     if(foundComment.author.id .equals(req.user._id)){
                        next();
                     }else{
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                     }
            }
         });
            
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    
}



middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.flash("error", "Please Login first!!");
    res.redirect("/login");
}


module.exports = middlewareObj;