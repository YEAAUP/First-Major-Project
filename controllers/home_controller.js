module.exports.home = function(req,res){
console.log(req.cookies);

res.cookie('User_Id',25);

    return res.render('home', {
        title: "Home"
    });
}