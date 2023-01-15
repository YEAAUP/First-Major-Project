const nodeMailer = require('../config/nodemailer');

// this is another way of exporting the method
exports.newComment = (comment)=> {

    let htmlString = nodeMailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');

    console.log("Inside newComment mailer");

    nodeMailer.transporter.sendMail({
        from: 'codeial.com',
        to: comment.user.email,
        subject: 'New Comment Published',
        html: htmlString
    },
    (err, info)=>{
        if(err){console.log("Error in sending the mail", err); return;}
        
        console.log("Mail Sent", info);
    }
    )
}