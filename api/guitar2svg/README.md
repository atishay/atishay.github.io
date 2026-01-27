# Guitar2SVG API

This API converts guitar tablature notation to SVG images using the JTab library.

## Implementation

The API has been updated to use **jsdom** instead of puppeteer/chromium for rendering guitar tablature. This provides a lighter, faster, and more reliable solution.

### Key Changes

1. **Replaced Dependencies:**
   - Removed: `puppeteer-core`, `@sparticuz/chrome-aws-lambda`
   - Added: `jsdom` for DOM emulation
   - Added: `jest` for testing

2. **New Implementation:**
   - Uses JSDOM to create a virtual DOM environment
   - Loads the JTab library (jQuery + Raphael.js) into the JSDOM context
   - Renders guitar tabs without needing a browser
   - Includes polyfills for SVG methods required by Raphael.js

3. **Testing:**
   - Comprehensive test suite in `test/guitar2svg.test.js`
   - Tests all chord examples from blog posts
   - Validates SVG structure and dimensions
   - Verifies API authentication and error handling

## Usage

### As a Netlify Function

The function is deployed at: `https://atishay.me/.netlify/functions/guitar2svg`

**Request:**
```
GET /.netlify/functions/guitar2svg?q=$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 ||&password=YOUR_PASSWORD
```

**Response:**
```xml
<svg height="65" version="1.1" width="423" xmlns="http://www.w3.org/2000/svg" ...>
  <!-- SVG content -->
</svg>
```

### In Hugo (via Shortcode)

```markdown
{{<guitar>}}$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 $1. $1. ||{{</guitar>}}
```

### Programmatically

```javascript
const { renderGuitarTab } = require('./api/guitar2svg/index.js');

const svg = renderGuitarTab('$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 ||');
console.log(svg); // Returns SVG string
```

## API Parameters

- `q` (required): Guitar tablature notation string
- `password` (required): API password (set via `API_PASSWORD` environment variable)

## Running Tests

```bash
npm test
```

## Tablature Notation

The API supports JTab notation format. Examples:

- Simple notes: `$1.0 $2.3 $3.2`
- Chords: `Em A C B7`
- Complex patterns: `$1.3 $1.2 $1.0 $2.1 $3.2 ||`

For more information on JTab notation, see: http://jtab.tardate.com

## Technical Details

### SVG Generation

1. JSDOM creates a virtual browser environment
2. JTab library (bundled in `index.html`) is loaded
3. Guitar tablature is rendered using Raphael.js (SVG library)
4. SVG is extracted, styled, and returned

### Polyfills

The implementation includes polyfills for SVG methods that JSDOM doesn't provide by default:
- `createSVGMatrix`
- `createSVGRect`
- `createSVGPoint`
- `createSVGTransform`

These polyfills ensure compatibility with Raphael.js's SVG generation.

## Performance

- No browser launch overhead (instant rendering)
- Cached JTab script for faster subsequent calls
- Lightweight dependencies (~50MB vs ~300MB for Chrome)
- Faster cold starts in serverless environments

## License

MIT
