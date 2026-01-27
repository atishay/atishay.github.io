const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

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
  
  // Extract the script content between <script> and </script>
  const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    throw new Error('Could not extract JTab script from index.html');
  }
  
  cachedJTabScript = scriptMatch[1];
  return cachedJTabScript;
}

/**
 * Render guitar tablature to SVG using JTab library in JSDOM
 */
function renderGuitarTab(query) {
  // Create a JSDOM instance with runScripts enabled
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
    // Add SVG method polyfills that JSDOM doesn't provide but Raphael.js needs
    if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGMatrix) {
      window.SVGSVGElement.prototype.createSVGMatrix = () => ({
        a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
        multiply() { return this; },
        inverse() { return this; },
        translate() { return this; },
        scale() { return this; },
        rotate() { return this; },
        skewX() { return this; },
        skewY() { return this; }
      });
    }

    if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGRect) {
      window.SVGSVGElement.prototype.createSVGRect = () => ({ x: 0, y: 0, width: 0, height: 0 });
    }

    if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGPoint) {
      window.SVGSVGElement.prototype.createSVGPoint = () => ({ x: 0, y: 0 });
    }

    if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGTransform) {
      window.SVGSVGElement.prototype.createSVGTransform = () => ({
        type: 0,
        matrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
        angle: 0,
        setMatrix() {},
        setTranslate() {},
        setScale() {},
        setRotate() {},
        setSkewX() {},
        setSkewY() {}
      });
    }

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
      throw new Error('Target element #jtab not found');
    }

    // Render the guitar tab
    jtab.render(targetElement, query);

    // Get the SVG element
    const svgElement = document.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG element generated');
    }

    // Get dimensions for viewBox
    const width = svgElement.getAttribute('width') || 0;
    const height = svgElement.getAttribute('height') || 0;
    
    // Calculate adjusted height (add 5 pixels as in original)
    const adjustedHeight = parseInt(height) + 5;

    // Set viewBox and height attributes
    svgElement.setAttribute('viewBox', `0 0 ${width} ${adjustedHeight}`);
    svgElement.setAttribute('height', adjustedHeight);
    
    // Add styling
    svgElement.setAttribute('style', 'overflow: hidden; position: relative; height: auto; max-width: 100%;');
    
    // Add the guitar class
    svgElement.setAttribute('class', 'guitar');

    // Get the SVG content from builder_0
    const builder = document.getElementById('builder_0');
    if (!builder) {
      throw new Error('Builder element not found');
    }

    // Post-process the SVG to fix issues with JSDOM's SVG handling
    let svgContent = builder.innerHTML;
    
    // Fix stroke colors - use currentColor instead of hardcoded black for dark mode support
    // This allows CSS to control the color based on light/dark mode
    svgContent = svgContent.replace(/stroke="none"/g, 'stroke="currentColor"');
    
    // Also fix text fill colors to use currentColor
    svgContent = svgContent.replace(/fill="none"/g, 'fill="currentColor"');
    
    // Fix dy values in tspan - JSDOM sets them to match y coordinate instead of being small offsets
    // Expected pattern: dy="4" for notes (to match Raphael output exactly)
    // Expected pattern: dy="10" for empty tspans (spacing)
    svgContent = svgContent.replace(/<tspan([^>]*)dy="(\d+)"([^>]*)>/g, (match, before, dy, after) => {
      const dyValue = parseInt(dy);
      // For dy=10, keep it (used for empty tspans)
      // For large dy values (>15), use 4 to match expected Raphael output
      const newDy = dyValue === 10 ? '10' : (dyValue > 15 ? '4' : dy);
      return `<tspan${before}dy="${newDy}"${after}>`;
    });

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

  try {
    // Render the guitar tab
    const svgOutput = renderGuitarTab(event.queryStringParameters.q);

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/svg+xml" },
      body: svgOutput,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to render guitar tab.",
        details: error.message,
      }),
    };
  }
}

module.exports = { handler, renderGuitarTab };
