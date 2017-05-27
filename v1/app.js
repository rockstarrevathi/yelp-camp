var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

 var campgrounds = [
        {name: "Atlanta", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        {name: "Oklahoma", image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
        {name: "Austin", image:"https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"},
        {name: "India", image:"https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg"},
        {name: "Atlanta", image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        {name: "Oklahoma", image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
        {name: "Austin", image:"https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"},
        {name: "India", image:"https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg"},
        
];

app.get("/",function(req,res){
   res.render("landing.ejs"); 
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds.ejs",{campgrounds: campgrounds});
});

app.post("/campgrounds",function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var newCampground = {name: name, image: image};
   campgrounds.push(newCampground);
   //redirect back to the campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
   res.render("new.ejs"); 
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The yelpcamp has started"); 
});