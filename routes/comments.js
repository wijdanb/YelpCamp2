var express = require("express");
var router = express.Router({mergeParams: true}); //Pass in an option inside of an object. Merges parameters from the campground and the comments together so inside the comment routes we can access :id that was defined. Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence.
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//=================================================================================
//Comment NEW
router.get("/new",middleware.isLoggedIn, function(req,res){ //when user makes a get request to the page with the form it will run isLoggedIn function first. isLoggedIn checks if the user is logged in. if the user IS logged in, it calls next.IF user is NOT logged in, then redirect 
    //find campground by id
    Campground.findById(req.params.id, function(err,campground){
        if(err){console.log(err);}
        
        else{
            res.render("comments/new", {campground: campground});
        }
        
    })
  
    
});
//Comments Create-finds the correct campground by using id then create the comment then push the comment into the comments array(into the campground)  
router.post("/",middleware.isLoggedIn, function(req,res){ //adding isLoggedIn as a security measure to prevent anyone from adding a comment by making a post request
   //lookup campground using the id
   Campground.findById(req.params.id,function(err,campground){
       //if it cant find the id, then thats a really big problem so need to redirect them
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       
       else{
           
              //create new comment
              Comment.create(req.body.comment,function(err,comment){
                  
                 if(err){
                     req.flash("error","Something went wrong");
                     console.log(err);
                     
                 }
                 else{
                     
                     //add username and id into comment
                     comment.author.username = req.user.username;
                     comment.author.id = req.user._id;
                     
                     //save comment
                     comment.save();
                
                     //then push comment into comments array on the campground and then save the whole campground!
                     campground.comments.push(comment);
                     campground.save();
                     req.flash("success","Successfully added comment");
                      //redirect campground showpage
                     res.redirect('/campgrounds/' + campground._id);
                 }
              });
       }
       
       
   })
 
    
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){ //comment_id is a different id than the :/id and also because there will be a syntax error if i use ":id" again for the comments id 
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground)
        {
            req.flash("error","No campground found");
            return res.redirect("back");
        }
        
        
    Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                   req.flash("success","Comment deleted");
                   res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
        
    });
   
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
   
    // Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){//takes the id to find by, data to update with and callback to run
    //  if(err){ 
    //      res.redirect("back");
    //      } 
    //      else{
    //      res.redirect("campgrounds/" + req.params.id );
    //  }
     
    
    
    // });
    
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){ //takes the id to find by, data to update with and callback to run
 
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
        
    });

});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){ 
   //findByIdAndRemove()
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){ res.redirect("back"); }
    else{
          res.redirect("/campgrounds/" + req.params.id);
        
    }
       
   });
    
});

 

module.exports = router;