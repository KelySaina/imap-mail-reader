const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");

// Configuration for Gmail IMAP
const config = {
  imap: {
    user: "kelysaina@gmail.com",
    password: "dxilukapxbaiaslr",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }, // Bypass certificate check
    authTimeout: 3000,
  },
};

// Function to read emails
async function fetchEmails() {
  try {
    // Connect to Gmail IMAP
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    // Search criteria for fetching unread emails
    const searchCriteria = ["UNSEEN"];
    const fetchOptions = {
      bodies: [""],
      markSeen: true, // Mark emails as read after fetching
    };

    // Fetch emails
    const messages = await connection.search(searchCriteria, fetchOptions);
    const emailData = [];

    for (const message of messages) {
      const all = message.parts.find((part) => part.which === "");
      const parsed = await simpleParser(all.body);

      // Extract email subject and text content
      const emailInfo = {
        subject: parsed.subject,
        textBody: parsed.text,
        htmlBody: parsed.html, // Optional: if you want HTML format
      };
      emailData.push(emailInfo);

      // Process or log the email content here
      console.log(`Subject: ${emailInfo.subject}`);
      console.log(`Body: ${emailInfo.textBody}`);
    }

    // Close the connection
    connection.end();
    return emailData;
  } catch (error) {
    console.error("Error reading emails:", error);
  }
}

// Function to continuously poll for new emails
function startEmailPolling(intervalMinutes = 5) {
  // Poll for emails immediately and then every specified interval
  fetchEmails();
  setInterval(fetchEmails, intervalMinutes * 60 * 1000);
}

// Export the polling function
module.exports = startEmailPolling;
