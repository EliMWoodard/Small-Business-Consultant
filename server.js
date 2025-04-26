const express = require("express");
const bodyParser = require("body-parser");
const generateAudit = require("./generateAudit");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Homepage route
app.get("/", (req, res) => {
  res.send("Welcome to the Small Business Consultant! Ready to generate your audit?");
});

app.post("/generate", async (req, res) => {
  try {
    const filePath = await generateAudit(req.body);
    res.download(path.resolve(filePath));
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
