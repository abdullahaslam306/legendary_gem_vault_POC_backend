let nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const smtpAuth = require("../config").smtpAuth;

const sendEmail = (mailDetails) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: 'thegemvault.store@gmail.com', //Will come from env later
      pass: 'Association50!@#', //Will Come from env
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
    from: "HoL Store",
    to: email,
    subject: "HoL store notification - TEST ONLY",
    templateObj: {
      emailText: `<p>Hi Legent, ${name}! You have purchased the a perk and your coupon number is: ${coupon}.</p>
       <p>Use this coupon upon checkout.</p>
       <p>This is for testing purposes only.</p>`,
    },
  });
};


module.exports = {
  sendCouponEmail,
};
