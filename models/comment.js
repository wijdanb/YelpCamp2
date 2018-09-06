var mongoose= require("mongoose");

var commentSchema = mongoose.Schema({
    
    text:String,
    createdAt: {type: Date, default: Date.now },
    author: {//wouldnt be effecient if we had to look up the correct author every time by taking an author id and then finding the author and finding its username.
    //INSTEAD just going to store the data right here inside the comment which is something that can ONLY be done in in a non-relational database like Mongo
        id:      {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User"
            
            
        },
        username: String
        
    } 
    
    
});

// {
    
//     username:"coolguy"
//     _id: 2323421.Array
//     hash: 91232342412495
//     salt: 20311
// }


module.exports = mongoose.model("Comment",commentSchema);

