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
  
  // FIRST: Mark chord diagram text (white text inside circles) BEFORE currentColor replacements
  // These are text elements with fill="#ffffff" that should have special dark mode handling
  svgContent = svgContent.replace(
    /<text([^>]*?)fill="#ffffff"([^>]*?)>/g,
    (match, before, after) => {
      // Mark as chord text and remove fill/stroke so CSS can control them
      // Remove any existing fill and stroke attributes
      let attrs = (before + after)
        .replace(/fill="[^"]*"/g, '')
        .replace(/stroke="[^"]*"/g, '')
        .trim();
      return `<text ${attrs} data-chord-text="true">`;
    }
  );
  
  // NOW apply currentColor for stroke/fill to support dark mode
  // This won't affect chord text since we removed fill/stroke from them above
  svgContent = svgContent.replace(/stroke="none"/g, 'stroke="currentColor"');
  svgContent = svgContent.replace(/fill="none"/g, 'fill="currentColor"');
  svgContent = svgContent.replace(/stroke="#000000"/g, 'stroke="currentColor"');
  svgContent = svgContent.replace(/stroke="#000"/g, 'stroke="currentColor"');
  svgContent = svgContent.replace(/fill="#000000"/g, 'fill="currentColor"');
  svgContent = svgContent.replace(/fill="#000"/g, 'fill="currentColor"');
  
  // Add comprehensive dark mode styles at the SVG level
  // This ensures proper contrast for chord text in all scenarios
  const styleBlock = `<defs><style type="text/css">
    /* Default (light mode): white text on black circles */
    [data-chord-text="true"],
    [data-chord-text="true"] tspan {
      fill: #ffffff !important;
      stroke: none !important;
    }
    
    /* Dark mode via media query */
    @media (prefers-color-scheme: dark) {
      [data-chord-text="true"],
      [data-chord-text="true"] tspan {
        fill: #000000 !important;
        stroke: none !important;
      }
    }
    
    /* Dark mode via class on body or container */
    .dark-mode [data-chord-text="true"],
    .dark-mode [data-chord-text="true"] tspan,
    body.dark-mode [data-chord-text="true"],
    body.dark-mode [data-chord-text="true"] tspan {
      fill: #000000 !important;
      stroke: none !important;
    }
  </style></defs>`;
  
  // Insert style block after opening <svg> tag (before or after existing <defs>)
  if (svgContent.includes('<defs')) {
    // If defs already exists, add our style inside the first defs
    svgContent = svgContent.replace(/(<defs[^>]*>)/, `$1${styleBlock.replace(/<\/?defs[^>]*>/g, '')}`);
  } else {
    // Otherwise insert our defs with style after the opening svg tag
    svgContent = svgContent.replace(/(<svg[^>]*>)/, `$1${styleBlock}`);
  }

  return svgContent;
}

module.exports = { postProcessSVG };
