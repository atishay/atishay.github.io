const MathjaxModule = require("mathjax");

let MathJax = null;
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
    if (!event.queryStringParameters || !event.queryStringParameters.tex) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "The required `tex` parameter not supplied.",
        }),
      };
    }
    if (!MathJax) {
      MathJax = await MathjaxModule.init({
        loader: { load: ["input/tex", "output/svg"] },
      });
    }

    const svg = MathJax.tex2svg(event.queryStringParameters.tex, {
      display: event.queryStringParameters.display
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/svg+xml" },
      body:  MathJax.startup.adaptor.outerHTML(svg),
    };
  },
};
