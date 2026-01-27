/**
 * SVG Post-Processing for Dark Mode and Compatibility
 *
 * Processes generated SVG to:
 * 1. Add dark mode support using currentColor
 * 2. Fix chord diagram text contrast (white text on black circles in light mode,
 *    black text on white circles in dark mode)
 */

/**
 * Post-process SVG content for dark mode and compatibility
 * @param {string} svgContent - Raw SVG HTML string
 * @returns {string} - Processed SVG HTML string
 */
function postProcessSVG(svgContent) {
  // Fix height - JSDOM renders 5px shorter than browser
  // Add 5px to match expected output
  svgContent = svgContent.replace(/height="(\d+)"/g, (match, h) => {
    return `height="${parseInt(h) + 5}"`;
  });
  svgContent = svgContent.replace(/viewBox="0 0 (\d+) (\d+)"/g, (match, w, h) => {
    return `viewBox="0 0 ${w} ${parseInt(h) + 5}"`;
  });

  // STEP 1: Identify and process chord text elements (fill="#ffffff")
  // Mark them with data-chord-text="true" for CSS targeting
  // Keep the fill="#ffffff" for light mode
  svgContent = svgContent.replace(
    /<text([^>]*?)fill="#ffffff"([^>]*?)>([\s\S]*?)<\/text>/g,
    (match, before, after, content) => {
      // Clean attributes
      let attrs = (before + after)
        .replace(/fill="[^"]*"/g, '')
        .replace(/stroke="[^"]*"/g, '')
        .trim();

      // Also add fill="#ffffff" to all tspan children
      content = content.replace(/<tspan([^>]*?)>/g, (tspanMatch, tspanAttrs) => {
        // Remove any existing fill/stroke from tspan
        let cleanTspanAttrs = tspanAttrs
          .replace(/fill="[^"]*"/g, '')
          .replace(/stroke="[^"]*"/g, '');
        return `<tspan${cleanTspanAttrs} fill="#ffffff">`;
      });

      return `<text ${attrs} fill="#ffffff" data-chord-text="true">${content}</text>`;
    }
  );

  // STEP 2: NOW apply currentColor to everything else (not chord text)
  // This makes the rest of the SVG adapt to dark mode
  svgContent = svgContent.replace(/stroke="none"/g, 'stroke="currentColor"');
  svgContent = svgContent.replace(/fill="none"/g, 'fill="currentColor"');
  svgContent = svgContent.replace(/stroke="#000000"/g, 'stroke="currentColor"');
  svgContent = svgContent.replace(/stroke="#000"/g, 'stroke="currentColor"');
  svgContent = svgContent.replace(/fill="#000000"/g, 'fill="currentColor"');
  svgContent = svgContent.replace(/fill="#000"/g, 'fill="currentColor"');

  // STEP 3: Add CSS for dark mode override
  // Only overrides chord text elements (those with data-chord-text="true")
  const styleBlock = `<defs><style type="text/css"><![CDATA[
    /* Light mode: inline fill="#ffffff" works naturally */

    * {
      fill: black;
    }

    /* Dark mode: override to black */
    @media (prefers-color-scheme: dark) {
      * {
        fill: white;
      }
      [data-chord-text="true"],
      [data-chord-text="true"] tspan {
        fill: #000000 !important;
      }
    }

    .dark-mode * {
      fill: white;
    }

    /* Dark mode via class */
    .dark-mode [data-chord-text="true"],
    .dark-mode [data-chord-text="true"] tspan,
    body.dark-mode [data-chord-text="true"],
    body.dark-mode [data-chord-text="true"] tspan {
      fill: #000000 !important;
    }
  ]]></style></defs>`;

  // Insert style block
  if (svgContent.includes('<defs')) {
    svgContent = svgContent.replace(/(<defs[^>]*>)/, `$1${styleBlock.replace(/<\/?defs[^>]*>/g, '')}`);
  } else {
    svgContent = svgContent.replace(/(<svg[^>]*>)/, `$1${styleBlock}`);
  }

  return svgContent;
}

module.exports = { postProcessSVG };
