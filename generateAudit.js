const { OpenAI } = require("openai");
const fs = require("fs");
const puppeteer = require("puppeteer");
const template = fs.readFileSync("pdfTemplate.html", "utf-8");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAudit(data) {
  const prompt = require("./promptTemplate")(data);

  const chat = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
  });

  const gptResponse = chat.choices[0].message.content;

  const filledHTML = template
    .replace("{{business_name}}", data.business_name)
    .replace("{{owner_name}}", data.owner_name)
    .replace("{{gpt_output_goes_here}}", gptResponse.replace(/\n/g, "<br>"));

  // Updated Puppeteer launch to avoid downloading Chromium
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
