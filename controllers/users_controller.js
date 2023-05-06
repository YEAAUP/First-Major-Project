// module.exports.home = function(req,res){
//     return res.render('home', {
//         title: "Home"
//     });
// }

const fs = require('fs');
const path = require('path');
const Friend = require('../models/friendship');


const User = require("../models/user");

module.exports.profile = async function (req, res){

    try{
        console.log(req.params.id)
    let friendShip = await Friend.find({$or:[{from_user:req.params.id, to_user:req.user._id},
    {from_user:req.user._id,to_user:req.params.id}]}
    );
    console.log(friendShip);
    let friend;
    let friendShipId=null;
    if(friendShip.length>0){
        console.log(friendShip[0].accepted);
        if(friendShip[0].accepted){
            friend="friend";
        }
        else{
            if(friendShip[0].to_user==req.user._id){
                friend="received";
            }
            else{
                friend="sent";
            }
        }
        friendShipId=friendShip[0]._id;
    }

    let user = await User.findById(req.params.id);
    return res.render('user_profile', {
        title: 'User Profile',
        profile_user: user,
        friend:friend,
        friendShipId:friendShipId
    });
}
    catch(err){
        console.log(err);
    }
    
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated');
    //         return res.redirect('back');
    //     });
    // } else{
    //     return res.status(401).send('Unauthorized');
    // }


    // Async- await
    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if(err)
                {
                    console.log("Multer Error : ", err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        // Check whether the file is available in the the database or not, if the file is present then only unlink that ---> It is a done later task
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    // this is saving path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }
    else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }

}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up'),{
        title: "Codeial | Sign Up"
    }

}

// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_in'),{
        title: "Codeial | Sign In"
    }
}


// get the sign up data
module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password){
        console.log("Password Not Matched");
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log('Error in finding the User in Signing up');
            return;
        }
        if(!user){
            User.create(req.body, function(err,user){
                if(err){console.log('error in creating user while signing up');return;}
                return res.redirect('/users/sign-in');
            })
        }
        else{
            return res.redirect('back');
        }

    })

}


// create a seesion for login
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}


module.exports.destroySession = function(req, res){
       
       req.logout(
        function(err) {
        if (err) { 
        req.flash('success','Logged Out Successfully');
        return next(err); 
          }}
    );
    req.flash('success','Logged Out Successfully');
    return res.redirect('/');
}