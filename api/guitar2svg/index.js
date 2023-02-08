const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chrome-aws-lambda');

module.exports = {
  /**
   * Function to handle calls to the API endpoint of the cloud function.
   */
  async handler(event, context) {
    if (
      !event.queryStringParameters ||
      !process.env.API_PASSWORD ||
      event.queryStringParameters.password !== process.env.API_PASSWORD
    ) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Access Denied.",
        }),
      };
    }
    if (!event.queryStringParameters || !event.queryStringParameters.q) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "The required `q` parameter not supplied.",
        }),
      };
    }

    const browser = await puppeteer.launch({
      // Required
      executablePath: await chromium.executablePath,

      // Optional
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless
    });
    const page = await browser.newPage();
    await page.goto("file://" + __dirname + "/index.html");

    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.evaluate((q) => {
      jtab.render(document.getElementById('jtab'), q);
      let x = document.querySelector("svg");
      let height = x.clientHeight + 5;
      x.setAttribute("viewBox", "0 0 " + x.clientWidth + " " + height);
      x.setAttribute("height", height);
      x.style.height = "auto";
      x.style.maxWidth = "100%";
      x.classList.add('guitar');
      return document.getElementById('builder_0').innerHTML;
    }, event.queryStringParameters.q);


    await browser.close();

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/svg+xml" },
      body: dimensions,
    };
  }
};