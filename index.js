const express = require("express");
const fs = require("fs/promises");
const cron = require("node-cron");
const axios = require("axios");
const app = express();
const PORT = 8000;

let registeredEmails = null;
app.use(express.json());

const setup = () => {
    console.log("Inside setup");
  fs.readFile(
    "./registered_emails/registeredEmail.json",
    "utf-8").then(data => {
        registeredEmails = JSON.parse(data);
        for (let i = 0; i < registeredEmails.length; i++) {
          const {
            email,
            bucketList,
            noOfQuestions,
            lastAttemptedQuestion,
            time,
          } = registeredEmails[i];
          const cronExpression = convertTimeToCronExpression(time);
          console.log("Calling send mail API for email id :: " + email + " " + cronExpression);
          cron.schedule(cronExpression, () => {
            const question =
              lastAttemptedQuestion === undefined ? 0 : lastAttemptedQuestion;
            axios.post("http://localhost:8000/api/v1/send-email", {
              email,
              bucketList,
              noOfQuestions,
              question,
            }).then((res) => {
              console.log("Leetcode questions will be sent to email " + email + " at " + time);
            }).catch((err) => {
              console.log("Error occurred while sending an email to :: ", email);
            })
          }); 
        }
        app.listen(PORT, () => {
            registeredEmails != null && console.log("Setup completed");
            console.log("Started server");
          });
    }).catch(err => console.log("Error occurred while reading the file", err));
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

app.post("/api/v1/send-email", (req, res) => {
    const {
        email,
        bucketList,
        noOfQuestions,
        lastAttemptedQuestion,
        time,
      } = res.body;
      console.log("Sending email to ",email);
  });

setup();
