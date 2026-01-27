const { renderGuitarTab, handler } = require('../api/guitar2svg/index.js');
const fs = require('fs');
const path = require('path');

describe('guitar2svg API', () => {
  describe('renderGuitarTab', () => {
    test('should render first chord from blog post', () => {
      const query = '$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 $1. $1. $2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 $1. $1. $2.1 $1.0 $1. ||';
      const svg = renderGuitarTab(query);

      // Verify it's valid SVG
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      
      // Verify it has the guitar class
      expect(svg).toContain('class="guitar"');
      
      // Verify it has xmlns
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      
      // Verify it has viewBox
      expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/);
      
      // Verify it has height attribute
      expect(svg).toMatch(/height="\d+"/);
      
      // Verify it contains path elements (strings and frets)
      expect(svg).toContain('<path');
      
      // Verify it contains text elements (notes)
      expect(svg).toContain('<text');
      
      // Verify it has the TAB labels
      expect(svg).toContain('>T</tspan>');
      expect(svg).toContain('>A</tspan>');
      expect(svg).toContain('>B</tspan>');
      
      // Verify dimensions are reasonable (should be around 423x65 based on sample)
      const widthMatch = svg.match(/width="(\d+)"/);
      const heightMatch = svg.match(/height="(\d+)"/);
      
      if (widthMatch && heightMatch) {
        const width = parseInt(widthMatch[1]);
        const height = parseInt(heightMatch[1]);
        
        expect(width).toBeGreaterThan(400);
        expect(width).toBeLessThan(450);
        expect(height).toBeGreaterThan(60);
        expect(height).toBeLessThan(70);
      }
    });

    test('should render second chord from blog post with Em ending', () => {
      const query = '$1.3 $1.2 $1.0 $2.1 $3.2 $1.0 $1.5 $1.2 $2.4 $2.0 $2.4 $1.5 $1.7 $1.5 $2.7 $2.4 $2.0 $2.4 Em ||';
      const svg = renderGuitarTab(query);

      // Verify basic SVG structure
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('class="guitar"');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      
      // Verify it has path and text elements
      expect(svg).toContain('<path');
      expect(svg).toContain('<text');
      
      // Verify TAB labels
      expect(svg).toContain('>T</tspan>');
      expect(svg).toContain('>A</tspan>');
      expect(svg).toContain('>B</tspan>');
    });

    test('should render chord keys', () => {
      const query = 'Em A C B7 E D B';
      const svg = renderGuitarTab(query);

      // Verify basic SVG structure
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('class="guitar"');
      
      // For chord symbols, the rendering will be different
      // Just verify it produces valid output
      expect(svg.length).toBeGreaterThan(100);
    });

    test('should handle simple tablature notation', () => {
      const query = '$1 0 2 $2 3 $1 0 2 $2 3 $1 0 3 2 ||';
      const svg = renderGuitarTab(query);

      // Verify basic SVG structure
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('class="guitar"');
      expect(svg).toContain('<path');
      expect(svg).toContain('<text');
    });

    test('should apply correct styling to SVG', () => {
      const query = '$2.0 $1.0 ||';
      const svg = renderGuitarTab(query);

      // Check for style attributes
      expect(svg).toMatch(/style="[^"]*height: auto[^"]*"/);
      expect(svg).toMatch(/style="[^"]*max-width: 100%[^"]*"/);
    });

    test('should throw error for invalid query', () => {
      expect(() => {
        renderGuitarTab('');
      }).toThrow();
    });
  });

  describe('handler', () => {
    const validPassword = 'test-password';
    
    beforeAll(() => {
      process.env.API_PASSWORD = validPassword;
    });

    test('should return 401 for missing password', async () => {
      const event = {
        queryStringParameters: {
          q: '$2.0 $1.0 ||'
        }
      };
      
      const response = await handler(event, {});
      
      expect(response.statusCode).toBe(401);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(response.body).error).toBe('Access Denied.');
    });

    test('should return 401 for invalid password', async () => {
      const event = {
        queryStringParameters: {
          q: '$2.0 $1.0 ||',
          password: 'wrong-password'
        }
      };
      
      const response = await handler(event, {});
      
      expect(response.statusCode).toBe(401);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(response.body).error).toBe('Access Denied.');
    });

    test('should return 400 for missing q parameter', async () => {
      const event = {
        queryStringParameters: {
          password: validPassword
        }
      };
      
      const response = await handler(event, {});
      
      expect(response.statusCode).toBe(400);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(response.body).error).toContain('required');
    });

    test('should return 200 with valid SVG for valid request', async () => {
      const event = {
        queryStringParameters: {
          q: '$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 $1. $1. ||',
          password: validPassword
        }
      };
      
      const response = await handler(event, {});
      
      expect(response.statusCode).toBe(200);
      expect(response.headers['Content-Type']).toBe('image/svg+xml');
      expect(response.body).toContain('<svg');
      expect(response.body).toContain('</svg>');
      expect(response.body).toContain('class="guitar"');
    });

    test('should handle complex chord progressions', async () => {
      const event = {
        queryStringParameters: {
          q: '$1.3 $1.2 $1.0 $2.1 $3.2 $1.0 $1.5 $1.2 $2.4 $2.0 $2.4 $1.5 ||',
          password: validPassword
        }
      };
      
      const response = await handler(event, {});
      
      expect(response.statusCode).toBe(200);
      expect(response.headers['Content-Type']).toBe('image/svg+xml');
      expect(response.body).toContain('<svg');
    });
  });

  describe('SVG validation', () => {
    test('should contain required SVG elements', () => {
      const query = '$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 ||';
      const svg = renderGuitarTab(query);

      // Parse SVG to check structure
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
      
      // Should have desc tag (Raphael signature)
      expect(svg).toContain('<desc');
      expect(svg).toContain('Raphaël');
      
      // Should have defs tag
      expect(svg).toContain('<defs');
    });

    test('should have proper dimensions', () => {
      const query = '$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 ||';
      const svg = renderGuitarTab(query);

      // Extract dimensions
      const widthMatch = svg.match(/width="(\d+)"/);
      const heightMatch = svg.match(/height="(\d+)"/);
      const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);

      expect(widthMatch).toBeTruthy();
      expect(heightMatch).toBeTruthy();
      expect(viewBoxMatch).toBeTruthy();

      if (widthMatch && heightMatch && viewBoxMatch) {
        const width = parseInt(widthMatch[1]);
        const height = parseInt(heightMatch[1]);
        const viewBoxWidth = parseInt(viewBoxMatch[1]);
        const viewBoxHeight = parseInt(viewBoxMatch[2]);

        // Width should match viewBox width
        expect(width).toBe(viewBoxWidth);
        
        // ViewBox height should be height (with the +5 adjustment)
        expect(viewBoxHeight).toBe(height);
      }
    });

    test('should contain guitar fretboard elements', () => {
      const query = '$2.0 $1.0 ||';
      const svg = renderGuitarTab(query);

      // Should have multiple path elements for strings and frets
      const pathCount = (svg.match(/<path/g) || []).length;
      expect(pathCount).toBeGreaterThan(5); // At least some strings and frets

      // Should have currentColor for dark mode support
      expect(svg).toContain('currentColor');
      
      // Should have path elements with d attribute (drawing commands)
      expect(svg).toMatch(/<path[^>]*d="M[\d,]+L[\d,]+"/);
    });
  });

  describe('Compare with expected output', () => {
    test('should match structure of sample output file', () => {
      const query = '$2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 $1. $1. $2.0 $1.0 $1. $1.7 $2.8 $2.7 $1.0 $1. $1. $2.1 $1.0 $1. ||';
      const svg = renderGuitarTab(query);

      // Load the expected output
      const expectedFile = path.join(__dirname, '../resources/_gen/getjson/05d196b4b114e87d8c230309b7e7f6b3');
      const expectedData = JSON.parse(fs.readFileSync(expectedFile, 'utf8'));

      // Verify query matches
      expect(expectedData.query).toBe(query);

      // Verify our output has similar structure
      const expectedSvg = expectedData.svg;

      // Check key elements are present
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('class="guitar"');
      
      // Check for TAB labels
      expect(svg).toContain('>T</tspan>');
      expect(svg).toContain('>A</tspan>');
      expect(svg).toContain('>B</tspan>');

      // Extract dimensions from both
      const ourWidth = svg.match(/width="(\d+)"/)?.[1];
      const ourHeight = svg.match(/height="(\d+)"/)?.[1];
      const expectedWidth = expectedSvg.match(/width="(\d+)"/)?.[1];
      const expectedHeight = expectedSvg.match(/height="(\d+)"/)?.[1];

      // Dimensions should be the same
      expect(ourWidth).toBe(expectedWidth);
      expect(ourHeight).toBe(expectedHeight);

      // Check that we have similar number of elements
      const ourPaths = (svg.match(/<path/g) || []).length;
      const expectedPaths = (expectedSvg.match(/<path/g) || []).length;
      expect(ourPaths).toBe(expectedPaths);

      const ourTexts = (svg.match(/<text/g) || []).length;
      const expectedTexts = (expectedSvg.match(/<text/g) || []).length;
      expect(ourTexts).toBe(expectedTexts);
    });

    test('should match dy values for blog 41-tujhe-dekha intro 1', () => {
      const expectedFile = path.join(__dirname, '../resources/_gen/getjson/2e43754954c04799be6d8faf2a9e714d');
      const expectedData = JSON.parse(fs.readFileSync(expectedFile, 'utf8'));
      const query = expectedData.query;
      
      const svg = renderGuitarTab(query);
      const expectedSvg = expectedData.svg;
      
      // Verify query
      expect(query).toBe('$1 0 0 0 7 5 7 3 5 8 7 ||');
      
      // Check dy values match exactly
      const expectedDy = [...new Set(expectedSvg.match(/dy="[^"]+"/g))].sort();
      const generatedDy = [...new Set(svg.match(/dy="[^"]+"/g))].sort();
      expect(JSON.stringify(generatedDy)).toBe(JSON.stringify(expectedDy));
      
      // Check tspan count
      const expectedTspanCount = (expectedSvg.match(/<tspan/g) || []).length;
      const generatedTspanCount = (svg.match(/<tspan/g) || []).length;
      expect(generatedTspanCount).toBe(expectedTspanCount);
    });

    test('should match dy values for blog 41-tujhe-dekha intro 2', () => {
      const expectedFile = path.join(__dirname, '../resources/_gen/getjson/339f301e69ede590fcf6b6fb9b33bc03');
      const expectedData = JSON.parse(fs.readFileSync(expectedFile, 'utf8'));
      const query = expectedData.query;
      
      const svg = renderGuitarTab(query);
      const expectedSvg = expectedData.svg;
      
      // Verify query
      expect(query).toBe('$1 0 0 0 7 5 7 3 5 3 2 ||');
      
      // Check dy values match exactly
      const expectedDy = [...new Set(expectedSvg.match(/dy="[^"]+"/g))].sort();
      const generatedDy = [...new Set(svg.match(/dy="[^"]+"/g))].sort();
      expect(JSON.stringify(generatedDy)).toBe(JSON.stringify(expectedDy));
      
      // Check tspan count
      const expectedTspanCount = (expectedSvg.match(/<tspan/g) || []).length;
      const generatedTspanCount = (svg.match(/<tspan/g) || []).length;
      expect(generatedTspanCount).toBe(expectedTspanCount);
    });
  });
});
