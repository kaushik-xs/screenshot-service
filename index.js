const express = require('express')
const app = express()
const port = 8080
const puppeteer = require("puppeteer");
const cors = require("cors");
var fs = require('fs');
const os = require("os");

// var corsOptions = {
//     origin: ['https://chateleon.com', 'https://www.chateleon.com', 'http://localhost:3000'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }


function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

app.get("/", (req, res) => res.send("Service up and running"))
app.post('/generate', cors(), async (req, res) => {
  const url = req.query.url;
  let browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || null,
    args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
  });

  let page = await browser.newPage();
  await page.goto(url);
  const epochTime = Date.now();
  await page.screenshot({ path: `${os.tmpdir()}/example-${epochTime}.png` });
  await page.close();
  await browser.close();
  var base64str = base64_encode(`${os.tmpdir()}/example-${epochTime}.png`);
  res.json({
    screenshot: base64str
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})