let nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const smtpAuth = require("../config").smtpAuth;

const sendEmail = (mailDetails) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: 'iqrarh190@gmail.com',
      pass: 'Dummy123'
    },
  });
  // Open template file
  var source = fs.readFileSync(
    path.join(__dirname, "../templates/email.hbs"),
    "utf8"
  );
  // Create email generator
  var template = Handlebars.compile(source);

  transporter.sendMail(
    { ...mailDetails, html: template(mailDetails.templateObj)},
    function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent", info);
      }
    }
  );
};


const sendCouponEmail = async (email, name, coupon) => {
  sendEmail({
    from: " HOL Notification <donotreply@HOL.com>",
    to: email,
    subject: "HOL Email Verification",
    templateObj: {
      emailText: `<p>Hi ${name}, Congratulations!. You have bought the coupon with number(s) ${coupon}.</p>
       <p>Use this coupon to get discount on the store.</p>`,
    },
  });
};


module.exports = {
  sendCouponEmail,
};
