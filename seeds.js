//going to create a bunch of campgrounds and a few comments for each campground
//1. remove all campgrounds(maybe later also remove comments)
//2.then creating 3 campgrounds, all unique because its seed data
//3. when we create a campground, we create a comment for it but they'll all be same comments
 //4. need to add comment property to campground.
var mongoose= require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
                {
                    name: "Clouds Rest", 
                    image: "https://www.pinetreesociety.org/wp-content/uploads/2017/10/cabins-960x600.jpg",
                    description: "Its a great place to check out!!"
                    
                },
                
                {
                    name: "Black Mesa", 
                    image: "https://www.sanctuaryretreats.com/media/5313445/sanctuary-baines-camp-starbath.jpg",
                    description: "Be careful of the spiders!"
                    
                },
                
                
                {
                    name: "Novigrad Peak", 
                    image: "https://t-ec.bstatic.com/images/hotel/max1024x768/647/64748006.jpg",
                    description: "There is alot of soil and grass in the area with windy days"
                    
                }
                
                
                
           ]

//wipe everything out of database
function seedDB(){
    //remove all campgrounds
    Campground.remove({},function(err){
    
    if(err){
        console.log(err)
        
    }
    
    else
    {
        console.log("removed campgrounds");   
        
         data.forEach(function(seed)
          {//loop through the data array and create a campground for them. seed reperesents one of the data arr(kinda like an iterator)
             Campground.create(seed,function(err,campground)
             {
                  if(err)
                  {
                      console.log(err);
                  }
                  
                  else
                  {
                      console.log("added a campground");
                      //create a comment on each campground
                      Comment.create(
                          {
                              text:"This place is the greatest of all time",
                              author:"John"
                              
                          }, function(err,comment){
                              
                              if(err){console.log(err);}
                              
                              else{
                                     campground.comments.push(comment);
                                     campground.save();
                                     console.log("created new comment");
                              
                                  
                              }
                              
                          });
                      
                  }
              
             });
     
         });
    }
    
  });

  
  
 
}
  
  
  
  //add a few comments

    

module.exports = seedDB; //this will send the function seedDb out and will be stored inside of the seedDB in app and then to execute it in the app, i do seedDB()