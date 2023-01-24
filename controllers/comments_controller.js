const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
// const commentEmailWorker = require('../workers/comment_email_worker');
// const queue = require('../config/kue');
module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            console.log("Comment added successfully to database");
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user','name email');
            commentsMailer.newComment(comment);

            // ----- INSTALL REDIS AND THEN TRY DELAYED QUEUE BY UNCOMMENTING THE BELOW LINES --------------
            
            // let job = queue.create('emails', comment).save(function(err){
            //     if(err){ console.log("Error in creating the queue for emais.", err); return;}

            //     console.log(job.id);
            // });

            if (req.xhr){
                
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            res.redirect('/');

            }
    }catch(err){
        console.log('Error', err);
        return;
    }
        }

module.exports.destroy =async function(req,res){

    try{

        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;
            await Like.deleteMany({likeable:comment._id, onModel: 'Comment'});
            comment.remove();
            let post = Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id }}); 
            
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            
            return res.redirect('back');
            }
        else{
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error', err);
        return;
    }

    
    };