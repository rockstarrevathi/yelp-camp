var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds.js");
var seedDB = require("./seeds.js");
var Comment = require("./models/comment");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/users.js");
var methodOverride = require("method-override");

//requiring Routes
var commentsRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js")

//seedDB();  //seed the database
mongoose.connect("mongodb://localhost/yelp_camp_v11");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.locals.moment = require('moment');

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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The yelpcamp has started"); 
});