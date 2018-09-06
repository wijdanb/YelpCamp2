var mongoose = require("mongoose");
//SCHEMA SETUP
//4. need to add comment property to campground.
var campgroundSchema= new mongoose.Schema({
    
    name:  String,
    price: String,
    image: String,
    description: String,
    cost: Number,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {type: Date, default:Date.now },
    author: {
                id:{
                    
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User"
                  
                },
                
                username: String
            },
    
    
    comments: //comments property is an array of Comment ids so we're not embedding actual comments here. Just embedding an ID or a reference to the comments
    [ 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }    
    ]
    
});

module.exports = mongoose.model("Campground",campgroundSchema); //if i kept it like  var campground = mongoose.model("Campground",campgroundSchema); it would be a empty object in app.js when i require campground and then when it searches for it in Campground.find{} it will be empty!

 
//Compling Schema into a model. Created a campground object that is a pattern for a campground that now has a bunch of different pieces on it
// //when we save the catschema to a variable after compiling it into a model its not just a pattern anymore, but it has all the methods we want
// //it takes that pattern and builds this complex model that has all of the methods needed to use

// //The "Campground" in the model() is the name of our singular version of our model and will automatically take that and make a 
// // new collection in our database that would look like db.campgrounds


