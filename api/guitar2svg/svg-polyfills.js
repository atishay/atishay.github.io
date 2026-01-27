/**
 * SVG DOM Polyfills for JSDOM
 * 
 * JSDOM lacks full SVG DOM support, so we polyfill the essential methods
 * that Raphael.js needs to render guitar tabs correctly.
 */

/**
 * Install all SVG polyfills for JSDOM window
 * @param {Object} window - JSDOM window object
 */
function installSVGPolyfills(window) {
  // Add getComputedStyle polyfill for JSDOM
  if (!window.getComputedStyle) {
    window.getComputedStyle = (element) => {
      return {
        getPropertyValue: (prop) => {
          if (prop === 'font-size') return '10px';
          return '';
        }
      };
    };
  }

  // Implement proper getBBox for text elements
  // This returns accurate bounding box values so Raphael calculates correct dy offsets
  const originalGetBBox = window.SVGElement && window.SVGElement.prototype.getBBox;
  if (window.SVGElement) {
    window.SVGElement.prototype.getBBox = function() {
      const tagName = this.tagName.toLowerCase();
      
      if (tagName === 'text' || tagName === 'tspan') {
        const text = this.textContent || '';
        const textLength = text.length;
        
        // Get the y coordinate from the element
        let yCoord = 0;
        if (this.hasAttribute('y')) {
          yCoord = parseFloat(this.getAttribute('y'));
        } else if (this.parentElement && this.parentElement.hasAttribute('y')) {
          yCoord = parseFloat(this.parentElement.getAttribute('y'));
        }
        
        // Font metrics constants for 10px Arial font
        const FONT_SIZE = 10;
        const CHAR_WIDTH = 6; // Average width per character
        
        // Target dy values matching browser output
        const TARGET_DY_TEXT = 3.5;   // For numbers and letters
        const TARGET_DY_EMPTY = 10;   // For empty spacing elements
        
        // Calculate bbox values to achieve target dy
        // Raphael's formula: dy = y - (bbox.y + bbox.height/2)
        // Solving for bbox.y: bbox.y = y - dy - (bbox.height/2)
        
        let bboxY, bboxHeight, bboxWidth;
        
        if (textLength === 0) {
          // Empty tspan (used for spacing)
          // dy = 10 = y - (bbox.y + height/2)
          // With height=10: bbox.y = y - 10 - 5 = y - 15
          bboxHeight = FONT_SIZE;
          bboxY = yCoord - TARGET_DY_EMPTY - (bboxHeight / 2);
          bboxWidth = 0;
        } else {
          // Non-empty text (numbers, letters)
          // dy = 3.5 = y - (bbox.y + height/2)
          // With height=10: bbox.y = y - 3.5 - 5 = y - 8.5
          bboxHeight = FONT_SIZE;
          bboxY = yCoord - TARGET_DY_TEXT - (bboxHeight / 2);
          bboxWidth = textLength * CHAR_WIDTH;
        }
        
        return {
          x: 0,
          y: bboxY,
          width: bboxWidth,
          height: bboxHeight,
          x2: bboxWidth,
          y2: bboxY + bboxHeight
        };
      }
      
      // For non-text elements, try original or return safe defaults
      if (originalGetBBox) {
        try {
          return originalGetBBox.call(this);
        } catch (e) {
          // Fall through to default
        }
      }
      
      return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0 };
    };
  }

  // Polyfill createSVGMatrix with proper matrix operations
  if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGMatrix) {
    window.SVGSVGElement.prototype.createSVGMatrix = function() {
      return {
        a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
        multiply(secondMatrix) {
          const result = {
            a: this.a * secondMatrix.a + this.c * secondMatrix.b,
            b: this.b * secondMatrix.a + this.d * secondMatrix.b,
            c: this.a * secondMatrix.c + this.c * secondMatrix.d,
            d: this.b * secondMatrix.c + this.d * secondMatrix.d,
            e: this.a * secondMatrix.e + this.c * secondMatrix.f + this.e,
            f: this.b * secondMatrix.e + this.d * secondMatrix.f + this.f
          };
          Object.setPrototypeOf(result, this);
          return result;
        },
        inverse() {
          const det = this.a * this.d - this.b * this.c;
          if (det === 0) return this;
          const result = {
            a: this.d / det,
            b: -this.b / det,
            c: -this.c / det,
            d: this.a / det,
            e: (this.c * this.f - this.d * this.e) / det,
            f: (this.b * this.e - this.a * this.f) / det
          };
          Object.setPrototypeOf(result, this);
          return result;
        },
        translate(x, y) {
          return this.multiply({ a: 1, b: 0, c: 0, d: 1, e: x, f: y });
        },
        scale(scaleFactor) {
          return this.multiply({ a: scaleFactor, b: 0, c: 0, d: scaleFactor, e: 0, f: 0 });
        },
        rotate(angle) {
          const rad = (angle * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          return this.multiply({ a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 });
        },
        skewX(angle) {
          const tan = Math.tan((angle * Math.PI) / 180);
          return this.multiply({ a: 1, b: 0, c: tan, d: 1, e: 0, f: 0 });
        },
        skewY(angle) {
          const tan = Math.tan((angle * Math.PI) / 180);
          return this.multiply({ a: 1, b: tan, c: 0, d: 1, e: 0, f: 0 });
        }
      };
    };
  }

  // Polyfill createSVGRect
  if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGRect) {
    window.SVGSVGElement.prototype.createSVGRect = function() {
      return { x: 0, y: 0, width: 0, height: 0 };
    };
  }

  // Polyfill createSVGPoint
  if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGPoint) {
    window.SVGSVGElement.prototype.createSVGPoint = function() {
      return { x: 0, y: 0 };
    };
  }

  // Polyfill createSVGTransform
  if (window.SVGSVGElement && !window.SVGSVGElement.prototype.createSVGTransform) {
    window.SVGSVGElement.prototype.createSVGTransform = function() {
      const matrix = this.createSVGMatrix();
      return {
        type: 0,
        angle: 0,
        matrix: matrix,
        setMatrix(m) {
          this.matrix = m;
          this.type = 1;
        },
        setTranslate(tx, ty) {
          this.matrix = this.matrix.translate(tx, ty);
          this.type = 2;
        },
        setScale(sx, sy) {
          this.matrix = this.matrix.scale(sx);
          this.type = 3;
        },
        setRotate(angle, cx, cy) {
          this.angle = angle;
          this.matrix = this.matrix.translate(cx, cy).rotate(angle).translate(-cx, -cy);
          this.type = 4;
        },
        setSkewX(angle) {
          this.angle = angle;
          this.matrix = this.matrix.skewX(angle);
          this.type = 5;
        },
        setSkewY(angle) {
          this.angle = angle;
          this.matrix = this.matrix.skewY(angle);
          this.type = 6;
        }
      };
    }.bind(window.SVGSVGElement.prototype);
  }
}

module.exports = { installSVGPolyfills };
