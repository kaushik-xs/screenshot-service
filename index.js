const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer');
var fs = require('fs');

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


app.get('/', async (req, res) => {
    const url = req.query.url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: 'example.png'});
    var base64str = base64_encode('example.png');
    res.json({
        screenshot: base64str
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})