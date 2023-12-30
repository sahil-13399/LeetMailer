const express = require("express");
const fs = require("fs/promises");
const cron = require("node-cron");
const axios = require("axios");
const sendEmail = require('./sendEmail')
const app = express();
const PORT = 8000;
const REGISTERED_EMAILS_FILE = "./registered_emails/registeredEmail.json";

app.use(express.json());

const setup = async () => {
  try {
    console.log("Inside setup");
    const data = await fs.readFile(REGISTERED_EMAILS_FILE, "utf-8");
    const registeredEmails = JSON.parse(data);

    for (const {
      email,
      bucketList,
      noOfQuestions,
      lastAttemptedQuestion,
      time,
    } of registeredEmails) {
      const cronExpression = convertTimeToCronExpression(time);
      console.log(`Calling send mail API for email id: ${email} ${cronExpression}`);

      cron.schedule(cronExpression, async () => {
        const question = lastAttemptedQuestion || 0;

        try {
          const response = await axios.post("http://localhost:8000/api/v1/send-email", {
            email,
            bucketList,
            noOfQuestions,
            question,
          });
          console.log(`Leetcode questions will be sent to email ${email} at ${time}`);
        } catch (err) {
          console.error(`Error occurred while sending an email to: ${email}`, err);
        }
      });
    }

    app.listen(PORT, () => {
      registeredEmails !== null && console.log("Setup completed");
      console.log("Server started");
    });
  } catch (err) {
    console.error("Error occurred while reading the file", err);
  }
};

function convertTimeToCronExpression(time) {
  const [hours, minutes] = time.split(":");

  // Validate input
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error("Invalid input time format.");
  }

  // Create a cron expression in the format 'mm hh * * *'
  const cronExpression = `${minutes} ${hours} * * *`;

  return cronExpression;
}

app.get("/", (req, res) => {
  res.json({ message: "Leetmailer app" });
});

app.post("/api/v1/send-email",async (req, res) => {
  const { email, bucketList, noOfQuestions, lastAttemptedQuestion, time } = req.body;
  await sendEmail(email)
  console.log(`Sending email to ${email}`);
});

setup();
