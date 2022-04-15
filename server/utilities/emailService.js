let nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const smtpAuth = require("../config").smtpAuth;
const AWS = require('aws-sdk')

const sendEmail = async (mailDetails) => {
    const ses = new AWS.SES({region: 'us-west-1'});

  const transporter = nodemailer.createTransport({
    SES: ses,
  });

  try {
     var source = fs.readFileSync(
    path.join(__dirname, "../templates/email.hbs"),
    "utf8"
  );
   var template = Handlebars.compile(source);
    await transporter.sendMail({
      from: 'store@gems.houseoflegends.io', 
      to: mailDetails.to,
      subject: mailDetails.subject,
      html: template(mailDetails.templateObj)
      });

  } catch (error) {
    console.error('error sending email:' ,error);
  }
};
const sendCouponEmail = async (email, name, perkName, coupon) => {
  sendEmail({
    from: "HOL Notification",
    to: email,
    subject: "Gem Vault: Your Legendary Code!💎",
    templateObj: {
      emailText: `<p>Congratulations on your purchase, you Legend!</p>
      <p>Hi ${name},</p>
      <p>This is a confirmation that you have purchased ${perkName} and your one-time coupon code is ${coupon}.</p>
       <p>Use this coupon at checkout in our Legendary Shop to redeem it for exciting discounts on exclusive HOL merch that you'll love! </p>
       <a href='https://www.houseoflegends.art/shop'>Shop Now</a>
       <p>You are a few clicks away from exploring the most Legendary store in the Metaverse. </p>
       <p>Join us on  <a href='https://twitter.com/TheLegendsNFTs'>Twitter</a> | <a href='https://www.instagram.com/houseoflegends.nft/'>Instagram</a></p>
       <p>Copyright<p>`,
    },
  });
};

module.exports = {
  sendCouponEmail,
};
