var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users");

//Root route
router.get("/",function(req,res){
   res.render("landing.ejs"); 
});


//======================
//Auth Routes
//======================

//====================================== Register=================================
//show register form
router.get("/register",function(req,res){
   res.render("register.ejs"); 
});

//handle signup logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register");
      } 
      passport.authenticate("local")( req, res, function(){
          res.redirect("/campgrounds");
      });
    });
});
//=========================================Login============================
//Show login form
router.get("/login",function(req,res){
   res.render("login.ejs"); 
});

//handling login logic
router.post("/login",passport.authenticate("local",
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),function(req,res){
});

//====================================Logout==================================
router.get("/logout",function(req,res){
   req.logout(); 
   res.redirect("/campgrounds");
});

//==============middleware==========
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
