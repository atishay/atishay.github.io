const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { installSVGPolyfills } = require('./svg-polyfills');
const { postProcessSVG } = require('./svg-postprocess');

// Cache the HTML content
let cachedJTabScript = null;

/**
 * Load and cache the JTab library from index.html
 */
function getJTabScript() {
  if (cachedJTabScript) {
    return cachedJTabScript;
  }

  const htmlPath = path.join(__dirname, 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract the script content between <script> tags
  const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    throw new Error('Could not find JTab script in index.html');
  }
  
  cachedJTabScript = scriptMatch[1];
  return cachedJTabScript;
}

/**
 * Render guitar tablature to SVG using JTab library in JSDOM
 * @param {string} tabString - Guitar tab notation string
 * @returns {string} - SVG markup as string
 */
function renderGuitarTab(tabString) {
  // Create a minimal HTML document with JSDOM
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <div id="jtab"></div>
        <div id="builder_0"></div>
      </body>
    </html>
  `, {
    runScripts: 'dangerously',
    resources: 'usable'
  });

  const { window } = dom;
  const { document } = window;

  try {
    // Install all SVG polyfills for JSDOM
    installSVGPolyfills(window);

    // Load and execute the JTab library script
    const jtabScript = getJTabScript();
    
    // Create a script element and add it to execute the code
    const scriptEl = document.createElement('script');
    scriptEl.textContent = jtabScript;
    document.head.appendChild(scriptEl);

    // Get the jtab object from the window
    const jtab = window.jtab;
    if (!jtab) {
      throw new Error('JTab library not loaded properly');
    }

    // Get the target element
    const targetElement = document.getElementById('jtab');
    if (!targetElement) {
      throw new Error('Target element not found');
    }

    // Render the tab notation
    jtab.render(targetElement, tabString);

    // Get the SVG content from builder_0 (where JTab puts the SVG)
    const builder = document.getElementById('builder_0');
    if (!builder) {
      throw new Error('Builder element not found');
    }

    // Find the SVG element that was created
    const svgElement = builder.querySelector('svg');
    if (!svgElement) {
      throw new Error('SVG element not created');
    }

    // Get dimensions for viewBox
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');
    
    // Add viewBox attribute
    if (width && height) {
      svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    // Add styling
    svgElement.setAttribute('style', 'overflow: hidden; position: relative; height: auto; max-width: 100%;');
    
    // Add the guitar class
    svgElement.setAttribute('class', 'guitar');

    // Post-process the SVG for dark mode support and chord text contrast
    const svgContent = postProcessSVG(builder.innerHTML);

    return svgContent;
  } catch (error) {
    throw new Error(`Failed to render guitar tab: ${error.message}`);
  } finally {
    window.close();
  }
}

/**
 * Function to handle calls to the API endpoint of the cloud function.
 */
async function handler(event) {
  // Check authentication
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

  // Check for required query parameter
  if (!event.queryStringParameters || !event.queryStringParameters.q) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "The required `q` parameter not supplied.",
      }),
    };
  }

  const tab = event.queryStringParameters.q;

  try {
    const svg = renderGuitarTab(tab);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/svg+xml" },
      body: svg,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}

module.exports = { renderGuitarTab, handler };
