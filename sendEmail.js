const nodemailer = require("nodemailer");
const fs = require('fs/promises')
const readHtmlTemplate = require("./emailTemplate")

async function createTransporter() {
    try {
      const secretsData = await fs.readFile('./resources/secrets.json', 'utf-8');
      const secrets = JSON.parse(secretsData);
      
      return nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        auth: {
          user: secrets.email.user,
          pass: secrets.email.pass,
        },
      });
    } catch (error) {
      console.error('Error reading secrets file:', error);
      throw error;
    }
  }

async function sendEmail(email) {
  // send mail with defined transport object
  const transporter = await createTransporter();
  const htmlTemplate = await readHtmlTemplate([
    { link: "https://leetcode.com/problems/first-leetcode-question" },
    { link: "https://leetcode.com/problems/second-leetcode-question" },
  ]);

  const info = await transporter.sendMail({
    from: '"LeetMailer" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Leetcode questions", // Subject line
    html: htmlTemplate, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;