//express router
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//INDEX Route-Displays list of all campgrounds
router.get("/", function(req,res){
       var noMatch;
    // res.render("campgrounds",{campgrounds:campgrounds}); //retrieve ALL campgrounds from database
  //  eval(require("locus")); //whenever we send a request to this route, it hits this and freezes our code and can see all the values of the variables assigned.
   if(req.query.search){
         const regex = new RegExp(escapeRegex(req.query.search),"gi"); //making variable regex out of a new reg expression and pases the return of value of function down below and passes flags like g is global and i is ignore case
       
         Campground.find({name: regex},function(err,allCampgrounds){
         if(err)
         {
               console.log(err);
         }
         else
         {   var noMatch;
             if(allCampgrounds.length < 1){
              noMatch ="No campgrounds match that query, please try it again";
             }
             
             
             //req.user has username and id of currently logged on user
             res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch, currentUser: req.user,page: "campgrounds"}); //still rendering campgrounds file(now called index,following RESTFUL pattern) and in the file we're expecting it to be called campgrounds,difference is is the source of the campground is no longer the array we had up in the global space
         }
             
        });
       
       
   }
   else{
    console.log(req.user);
     //retrieve ALL campgrounds from database
     Campground.find({},function(err,allCampgrounds){ //the {} means it looks through everything and also does the callback function (function(err,campground)
         if(err)
         {
             
             console.log(err);
             
         }
         else
         {                                                              //req.user has username and id of currently logged on user
             res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch, currentUser: req.user,page: "campgrounds"}); //still rendering campgrounds file(now called index,following RESTFUL pattern) and in the file we're expecting it to be called campgrounds,difference is is the source of the campground is no longer the array we had up in the global space
         }
         
     });
   }
});  

//CREATE Route- Add new campgrounds to databse
router.post("/",middleware.isLoggedIn,function(req,res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var cost = req.body.cost;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
        console.log("CREATE ROUTE ERROR!");
         console.log("Location is:" + req.body.location);
         console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image,cost: cost, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

//NEW Route- Display form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    
    res.render("campgrounds/new");
    
});


//SHOW Route- Shows info about one campground. PUT THIS after(?) app.get("/campgrounds/new",..) otherwise it wont show up!ORDERING IS IMPORTANT
router.get("/:id", function(req,res){
    //find campground with provided ID
    //new method mongoose gives us called findById
     //finding the right campground with the id and the campground thats coming back has comment array with objectids and to get the comments, we wanna pass the comment to the SHOW template. Need to use .populate.exec
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){ //if not found campground OR error
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){}
        else{
        res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
          
 
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log("ERROR IN UPDATE ROUTE!");
            
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
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
    
    //DESTROY CAMPGROUND ROUTE
    router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
       Campground.findByIdAndRemove(req.params.id,function(err){
           if(err){
               res.redirect("/campgrounds");
           }
           else{   
                res.redirect("/campgrounds");
           }
           
       });
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"); //match any characters globally. this is for security gainst DDOS
    
};
 

module.exports = router;           