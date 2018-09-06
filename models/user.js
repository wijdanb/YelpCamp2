var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    
   username:String,
   password:String,
    
    
});

UserSchema.plugin(passportLocalMongoose); //ADDS IN METHODS TO OUR USER

module.exports = mongoose.model("User",UserSchema);
