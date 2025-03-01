const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toggleLike = async function(req, res){
    try{
        //likes/toggle/?id=abcd&type=Post

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');

        } else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // Checking if the like already existing
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // If Like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }
        else{
            // Else create one
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type

            });

            likeable.likes.push(newLike._id);
            likeable.save();

            
        }

        return res.json(200, {
            message: 'Request Successful!',
            data: {
                deleted:deleted
            }
        });

    }catch(err){
        console.log("Error in Like Controller", err);
        return res.json(500, {
            message: 'Internal Server Error!'
        });
    }
}