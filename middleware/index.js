var Campground = require("../models/campground");
var Comment = require("../models/comment");
//ALL the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    //check if user is even logged in
        if(req.isAuthenticated())
        {   
         //does the user own the campground?
             Campground.findById(req.params.id,function(err,foundCampground)
             { //if id of that author of that campground matches the current user
                if(err || !foundCampground) //if error OR foundCampground is empty then:
                {   
                    req.flash("error","Campgrounds not found");
                    res.redirect("back"); }
                
             else{
                 //does user own the campground?
                // if(Campground.author.id === req.user._id){ //Comparing these two should work but it doesnt because req.user._id is a String and foundCampground.author.id is a Mongoose object! campground.author.id is 523423424a42eht4954200c and req.user._id is 523423424a42eht4954200c BUT BEHIND THE SCENES THEY ARE DIFFERENT!!
                   if(foundCampground.author.id.equals(req.user._id)){
                       next();
                   }
                   else{
                       req.flash("error","You do not have permission to do that");
                       res.redirect("back");
                   }
                    
                 }
             });
        }
    
        else
        {
              
          res.redirect("back"); //takes user back to where they came from. the previous page they were on
    }
}
    

middlewareObj.checkCommentOwnership = function(req,res,next){
    //check if user is even logged in
        if(req.isAuthenticated())
        {   
         //does the user own the comment?
             Comment.findById(req.params.comment_id,function(err,foundComment)
             { //if id of that author of that campground matches the current user
                if(err || !foundComment)
                { 
                    req.flash("error","Comment not found");
                    res.redirect("back"); }
                
             else{
                 //does user own the comment?
                // if(foundComment.author.id === req.user._id){ //Comparing these two should work but it doesnt because req.user._id is a String and foundCampground.author.id is a Mongoose object! campground.author.id is 523423424a42eht4954200c and req.user._id is 523423424a42eht4954200c BUT BEHIND THE SCENES THEY ARE DIFFERENT!!
                   if(foundComment.author.id.equals(req.user._id)){
                       next();
                   }
                   else{
                       req.flash("error","You do not have permission to do that");
                       res.redirect("back");
                   }
                    
                 }
             });
        }
    
        else
        {
          req.flash("error","You need to be logged in to do that");
          res.redirect("back"); //takes user back to where they came from. the previous page they were on
    }
    
}



//when user makes a get request to the page with the form it will run isLoggedIn function first. 
//isLoggedIn checks if the user is logged in. if the user IS logged in, it calls next.IF user is NOT logged in, then redirect
//middleware
middlewareObj.isLoggedIn = function(req,res,next) 
{
    if(req.isAuthenticated()){
        return next();
        
    }
    req.flash("error","You need to be logged in to do that")//error is key, "please login first" is value //This line doesnt display this! This line/function gives us the capability to give us a way of accessing this on the next request. It takes "Please Login first" and adds it to the flash and it will only flash it on the next page. So do it BEFORE redirect
    res.redirect("/login");
    
}



module.exports = middlewareObj;