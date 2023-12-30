LeetMailer
LeetMailer is an application designed to assist users in maintaining consistency with their LeetCode practice by receiving practice questions via email from their selected bucket list.

User Stories
Primary Requirements
User Registration:

Users should register their Email ID, Bucket list, Time, and Number of questions.
Update Preferences:

Users should have the option to update their practice time and bucket list.
Unsubscribe:

Users can unsubscribe to stop receiving further emails.
Follow-up Email:

Upon completing all questions in the list, users receive a follow-up email to select a different list, repeat the list, or discontinue for now.
Secondary Requirements
Track Progress:

Track user progress by recording completed questions.
Automated List Addition:

Add more lists using an automated script.
Web UI:

Develop a web UI for easier interaction with APIs.
Technical Requirements
API Endpoints
Register User:

POST /api/v1/leet-mail/register
Request Body: {email: String, bucketList: String, time: String, noOfQuestions: int}
Upon registration, a cron job is created and job details are saved in the database.
Get User Details:

GET /api/v1/leet-mail/:email
Update User:

PUT /api/v1/leet-mail/:email
Allow users to update bucket list and time. If time is updated, reschedule the job with a new cron expression. If the question list is updated, change the lastQuestionAttempted.
Delete User:

DELETE /api/v1/leet-mail/:email
Deletes user by email and cancels the associated cron job.
Send Email Callback
Send Email:
Sends an email with the next question from the user's list.
Updates the object with the last attempted question and time.
Server Management
Restart Server:
Upon server restart, reinitialize cron jobs.
Implementation Details
Randomization:

Randomize the question list and generate an integer. Save it in the database with the key as lastAttemptedQuestion.
Update Mechanism:

When updating the question list, change lastQuestionAttempted using the formula: randInt(0, noOfQuestions) % noOfQuestions.
Additional Topics
Before deploying and managing the LeetMailer application, consider going through the following topics:

Secret Management:

Implement secure secret management practices.
Unit Testing:

Develop and execute unit tests to ensure the reliability of the application.
Dockerization:

Containerize the application using Docker, including the MongoDB database.
Deployment:

Plan and execute the deployment of LeetMailer in a production environment.
CI/CD:

Set up Continuous Integration and Continuous Deployment pipelines for code builds and automated deployments.