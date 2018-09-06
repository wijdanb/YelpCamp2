require('dotenv').config();

var express= require("express"),
    app=express(),
    bodyParser = require("body-parser"),
    mongoose= require("mongoose"),
    flash = require("connect-flash"), //express 4.0
    passport = require("passport"),
 
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v13"); //this will create yelp_camp db in mongodb

app.use(methodOverride("_method"));
app.use(flash());
//seedDB();// seed the database. 

//requiring routes
var commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index");


 

//passport config
app.locals.moment = require("moment");
app.use(require("express-session")({
    secret: "this is the secret",
    resave: false,
    saveUninitialized: false
}));
    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //added main.css file by including the path to it// __dirname is: /home/ubuntu/workspace/YelpCamp/v5

//adding our own middleware
app.use(function(req,res,next){//app.use will cause this function on every single route  as opposed to passing it manually to every route like:   res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user}); mainly the ,currentUser: req.user})
   res.locals.currentUser = req.user; //req.user will be empty if no one signed in OR it will contain the current user names ID. Every ROUTE will have currentUser available!
   res.locals.error = req.flash("error"); //if theres anything in the flash, we'll have access to it in the template under message
   res.locals.success = req.flash("success"); //if theres anything in the flash, we'll have access to it in the template under message
   next();
});
 
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes); //makes the route code cleaner in the header and arg section
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Yelpcamp has started");
    
    
});

                                                                                                