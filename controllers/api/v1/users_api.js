const User = require('../../../models/user');
const jwt = require('jsonwebtoken');



// create a seesion for login
module.exports.createSession = async function(req,res){
    try{
        let user = await User.findOne({email: req.body.email});

    if(!user || user.password!=req.body.password){
        return res.json(422, {
            message : "Invalid username or password"
        });
    }

    return res.json(200, {
        message : "Sign in successful, Here is your token please keep it secret",
        data : {
            token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '100000'})
        }
    });

    }
    catch(err)
    {
        console.log('********', err);
        return res.json(500, {
            message : "Internal Server Error"
        });
    }
  
}