const User = require('../models/user');
const Friend = require('../models/friendship');


module.exports.sendRequest = async function(req,res){

    try{
        var friendId = req.params.userId;
        console.log(friendId);
        console.log(req.user._id);

        var requestingUser = await User.findById(req.user._id);
        var requestedUser = await User.findById(friendId);

        var sent = await Friend.create({from_user:req.user._id, to_user:friendId, accepted:false});
        // console.log(sent);
        // console.log("Resquesting user...");
        // console.log(requestingUser);
        // console.log("Rquested User");
        // console.log(requestedUser);
        if(requestingUser && requestedUser && sent){
            requestingUser.sent_friend_request.push(sent._id);
            requestedUser.received_friend_request.push(sent._id);
            requestedUser.save();
            requestingUser.save();
        }
        // console.log("Resquesting user...");
        // console.log(requestingUser);
        // console.log("Rquested User");
        // console.log(requestedUser);
        console.log("Request sent.  From:"+req.user._id+" to :"+friendId);
        res.redirect('/');

    }
    catch(err){
        console.log('Error in sending friend request ... ',err);
    }


}

module.exports.acceptRequest = async function(req,res){

    try{
    let friend = req.params.friendId;
    let friendship = await Friend.findByIdAndUpdate(friend,{accepted:true});
    let friendId = friendship.from_user._id;

    await User.findByIdAndUpdate(friendId,{"$pull":{"sent_friend_request":friend}, "$push":{"friendships":friend}});
    await User.findByIdAndUpdate(req.user._id,{"$pull":{"received_friend_request":friend}, "$push":{"friendships":friend}});


    
    res.redirect('/');
    }
    catch(err){
        console.log("Error in acccepting thefriend request",err);
    }

}

module.exports.withdrawRequest = async function(req,res){
    try{
        let friend = req.params.friendId;
       
        let friendship = await Friend.findById(friend);
        console.log(friendship);
            
        await User.findByIdAndUpdate(friendship.to_user,{"$pull":{"received_friend_request":friend}});
        await User.findByIdAndUpdate(req.user._id,{"$pull":{"sent_friend_request":friend}});
        
        await Friend.findByIdAndDelete(friend);
        res.redirect('/');



    }
    catch(err){
        console.log("Error in Withdrawing the friend request", err);
    }

}

module.exports.rejectRequest = async function(req,res){
    try{
        let friend = req.params.friendId;
        let friendship = await Friend.findById(friend);
        let friendId = friendship.from_user._id;

        await User.findByIdAndUpdate(friendId,{"$pull":{"sent_friend_request":friend}});
        await User.findByIdAndUpdate(req.user._id,{"$pull":{"received_friend_request":friend}});

        await Friend.findByIdAndDelete(friend);
        
        res.redirect('/');



    }
    catch(err){
        console.log("Error in Rejecting  the friend request", err);
    }

}

module.exports.removeFriend = async function(req,res){
    try{
        let friend = req.params.friendId;
        let friendship = await Friend.findById(friend);
        let from=req.user._id;
        let to;
        if(friendship.from_user._id == from){
            to=friendship.to_user._id;
        }
        else{
            to=from;
            from=friendship.to_user._id;
        }

        await User.findByIdAndUpdate(from,{"$pull":{"friendships":friendship.from_user}});
        await User.findByIdAndUpdate(to,{"$pull":{"friendships":friendship.to_user}});

        await Friend.findByIdAndDelete(friend);
        
        res.redirect('/');



    }
    catch(err){
        console.log("Error in Removing the friend", err);
    }

}
