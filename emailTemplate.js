// Function to generate the complete HTML templat

function generateHtmlTemplate(questions) {
  const questionList = generateQuestionList(questions);

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LeetCode Questions</title>
        </head>
        <body>
          <h2>LeetCode Questions</h2>
          <p>Here are some LeetCode questions for you to practice:</p>
          <ol>
            ${questionList}
          </ol>
          <p>Happy coding!</p>
        </body>
      </html>`;
}

// Read the HTML template from a file
async function readHtmlTemplate(questions) {
  try {
    const htmlTemplate = generateHtmlTemplate(questions);
    return htmlTemplate;
  } catch (error) {
    console.error("Error generating HTML template:", error);
    throw error;
  }
}

function generateQuestionList(questions) {
  return questions
    .map((question, index) => {
      return `<li>
                <a href="${question.link}" target="_blank">Question ${
        index + 1
      }</a>
              </li>`;
    })
    .join("");
}

// Example email configuration with dynamically generated link

module.exports = readHtmlTemplate;
