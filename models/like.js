const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type : mongoose.Schema.ObjectId
    },

    //This defines the objectId of the liked object
    likeable : {
        type : mongoose.Schema.ObjectId,
        require : true,
        refpath : 'onModel'
    },
    
    //This field is used for defining the type of the liked object since this is a dynamic refrence
    onModel :{
        type : String,
        require : true,
        enum : ['Post', 'Comment']
    }
},
{
    timestamps : true
});


const Like = mongoose.model('Like', likeSchema);
module.exports = Like;