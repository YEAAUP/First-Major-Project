const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req,res){

//res.cookie('User_Id',25);

// Post.find({},function(err, posts){
//     return res.render('home', {
//         title: "Codeial | Home",
//         posts: posts
//         });
// })

try{
    //populating the user of each post
let posts = await Post.find({})
.sort('-createdAt')
.populate('user')
.populate({
    path: 'comments',
    populate: {
        path: 'user'
    }
})
.populate('likes');
    
let users = await User.find({});

    return res.render('home', {
        title: "Codeial | Home",
        posts: posts,
        all_users: users
        });

}catch(err){
    console.log('Error',err);
}


}



// Promises
// usinf then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();
// posts.then();