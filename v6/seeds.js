var mongoose = require("mongoose");
var Campground = require("./models/campgrounds.js");
var Comment = require("./models/comment.js");

var data =[
    {
        name: "Oklahoma",
        image:"https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
     {
        name: "Atlanta",
        image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
     {
        name: "Austin",
        image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({},function(err){
     if(err){
         console.log("removed campgrounds"); 
        }
        console.log("removed campgrounds");
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err,campground){
             if(err){
                    console.log(err);
             }else{
                console.log("added a campground");
                //create a comment
                Comment.create(
                    {text:"This place is great, but i wish there was internet",
                     author: "Revathi"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                        }
                    });
               }
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
