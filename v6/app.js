var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds.js");
var seedDB = require("./seeds.js");
var Comment = require("./models/comment");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/users.js");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//Passport Configuration
app.use(require("express-session")({
    secret:"Ha ha ha ha Mummy is my best friend",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user; 
   next();
});

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
            res.render("campgrounds/index.ejs",{campgrounds: allCampgrounds});

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
   res.render("campgrounds/new.ejs"); 
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
            res.render("campgrounds/show.ejs",{campground: foundCampground});
        }
    });
});

// =============================================
//              COMMENTS ROUTES
// =============================================

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err,campground){
       if(err){
           console.log(err);
       } else{
            res.render("comments/new.ejs", {campground: campground});
       }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
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
                   //connect new comment to campground
                campground.comments.push(comment);
                campground.save();
                   //redirectto campground show page
                res.redirect('/campgrounds/'+ campground._id);
                }
         });
      }
   });
});

//======================
//Auth Routes
//======================

//====================================== Register=================================
//show register form
app.get("/register",function(req,res){
   res.render("register.ejs"); 
});

//handle signup logic
app.post("/register", function(req,res){
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
app.get("/login",function(req,res){
   res.render("login.ejs"); 
});

//handling login logic
app.post("/login",passport.authenticate("local",
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),function(req,res){
});

//====================================Logout==================================
app.get("/logout",function(req,res){
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

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The yelpcamp has started"); 
});