const aws = require('aws-sdk');
const nodemailer = require("nodemailer");

// const sendEmail = () =>{
// const ses = new aws.SES({region : 'us-west-1'});
// const params = {
//     Destination : {
//         ToAddresses : ['abdullahaslam306@gmail.com'],
//     },
//     Message : {
//         Body: { 
//             Html: {Data: `<p>Hello</p>`}
//         }, 
//         Subject : { Data : 'Test'},

//     },
//     Source : 'store@gems.houseoflegends.io' 
// }
//   ses.sendEmail(params).promise().then(result => {
//       console.log(result)
//   })
//   .catch(Error=> {
//       console.log(Error)
//   })
// }

// sendEmail()


const sendEmail = async (to, subject, content) => {
const ses = new aws.SES({region: 'us-west-1'});

  const transporter = nodemailer.createTransport({
    SES: ses,
  });

  try {
    await transporter.sendMail({
      from: 'store@gems.houseoflegends.io',
      to,
      subject,
      html: content,
    });
    return true;
  } catch (error) {
    console.error('error sending email:' ,error);
    return false;
  }
}
sendEmail('abdullahaslam306@gmail.com','test','content')