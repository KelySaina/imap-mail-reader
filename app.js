const readEmails = require("./readEmail");

(async () => {
  const emails = await readEmails();
  console.log("Fetched Emails:", emails);
})();
