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

 console.log(users);
// console.log("<<<<<<<<<--------------------------->>>>>>>>>>>");
// console.log(req.user);
if(req.user){
    let friends = await User.findById(req.user).populate(
        {
            path:'friendships',
            populate:{
                path:'to_user from_user'
            }
        }
    );
    return res.render('home', {
        title: "Codeial | Home",
        posts: posts,
        userList: users,
        friendList:friends,
        userType:"friend"
        });
    }
    else{
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            userList: users,
            userType:"nothing"
            });
    }

}catch(err){
    console.log('Error',err);
}


}


module.exports.homeFriend = async function(req,res){
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
    if(req.user){
        let friends = await User.findById(req.user).populate(
            {
                path:'friendships',
                populate:{
                    path:'to_user from_user'
                }
            }
        );
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            userList: users,
            friendList:friends,
            userType:"friend"
            });
        }
        else
            res.redirect('/');
    
    }catch(err){
        console.log('Error',err);
    }
}


module.exports.homeReceived = async function(req,res){
    try{
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
    if(req.user){
        let recieved = await User.findById(req.user).populate(
            {
                path:'received_friend_request',
                populate:{
                    path:'from_user'
                }
            }
        );
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            userList: users,
            friendList:recieved,
            userType:"received"
            });
        }
        else{
            res.redirect('/');
        }
    
    }catch(err){
        console.log('Error',err);
    }
}

module.exports.homeSent = async function(req,res){

    try{
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
    
    if(req.user){
        let sent = await User.findById(req.user).populate(
            {
                path:'sent_friend_request',
                populate:{
                    path:'to_user'
                }
            }
        );
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            userList: users,
            friendList:sent,
            userType:"sent"
            });
        }
        else{
            res.redirect('/');
        }
    
    }catch(err){
        console.log('Error',err);
    }
}

// Promises
// usinf then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();
// posts.then();