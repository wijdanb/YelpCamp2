var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//in the log run to make code nicer, we need to constantly use require() and in the long term it makes sense to break things out like this, to have order and structure. It keeps app.js short
//root route
router.get("/", function(req,res){
    res.render("landing");
});
  
//===============================================================================

//AUTH ROUTES
//===============================================================================

//show register form
router.get("/register",function(req,res){
    
    res.render("register",{page: 'register'});
});

//handle sign up logic
router.post("/register",function(req,res){
    //username from form in register.ejs
    var newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){  //req.body.password is from form in register.ejs
    if(err){ 
        //cant sign up for some reason
        req.flash("error", err.message);
          console.log(err);
        return res.render("register", {error: err.message});
        //return res.redirect("/register");
    }
     
       //once the user signs up, we authenticate them
    passport.authenticate("local")(req, res, function(){
        req.flash("success","Succesfully Signed Up! Welcome to YelpCamp " + req.body.username);       
        res.redirect("/campgrounds"); 
        
        });
    
    
    });  
     
    
});

//show login form
router.get("/login",function(req,res){
    
    res.render("login", {page: "login"});
    
})

//handling login logic. 
//we presume the user already exists so thats why it doesnt go through the whole security loop like before in regestering

router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),  function(req,res){
        res.send("LOGIN LOGIC HAPPENS HERE");
    
});



//======================


//LOGOUT ROUTE
//======================
router.get("/logout",function(req,res){
    
   req.logout();//get this from the packages installed
   req.flash("successnode", "Logged you out");
   res.redirect("/campgrounds");
   
});

module.exports = router;