const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");
const template = fs.readFileSync("pdfTemplate.html", "utf-8");
require("dotenv").config();

async function generateAudit(data) {
  const prompt = require("./promptTemplate")(data);

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/google/flan-t5-large",
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      },
    }
  );

  const gptResponse = response.data[0]?.generated_text || "No response from model.";

  const filledHTML = template
    .replace("{{business_name}}", data.business_name)
    .replace("{{owner_name}}", data.owner_name)
    .replace("{{gpt_output_goes_here}}", gptResponse.replace(/\n/g, "<br>"));

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setContent(filledHTML, { waitUntil: "domcontentloaded" });
  const filePath = `./pdfs/${data.business_name.replace(/\s/g, "_")}_audit.pdf`;
  await page.pdf({ path: filePath, format: "A4", printBackground: true });
  await browser.close();

  return filePath;
}

module.exports = generateAudit;
