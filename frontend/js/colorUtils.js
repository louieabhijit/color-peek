/**
 * Color conversion and manipulation utilities
 * @module colorUtils
 */

// Cache for color conversions to improve performance
const colorConversionCache = new Map();

/**
 * Convert hex color to RGB components
 * @param {string} hex - Hex color code (e.g., "#FFFFFF")
 * @returns {number[]} Array of [r, g, b] values (0-255)
 */
function hexToRgb(hex) {
    const key = `${hex}-rgb`;
    if (colorConversionCache.has(key)) {
        return colorConversionCache.get(key);
    }

    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(x => x + x).join("");
    }
    const num = parseInt(hex, 16);
    const result = [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    colorConversionCache.set(key, result);
    return result;
}

/**
 * Convert RGB to HSL color space
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number[]} Array of [hue, saturation, lightness] values
 */
function rgbToHsl(r, g, b) {
    const key = `${r},${g},${b}-hsl`;
    if (colorConversionCache.has(key)) {
        return colorConversionCache.get(key);
    }

    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    const result = [h, s * 100, l * 100];
    colorConversionCache.set(key, result);
    return result;
}

/**
 * Convert RGB to HSV color space
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number[]} Array of [hue, saturation, value] values
 */
function rgbToHsv(r, g, b) {
    const key = `${r},${g},${b}-hsv`;
    if (colorConversionCache.has(key)) {
        return colorConversionCache.get(key);
    }

    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    const result = [h, s * 100, v * 100];
    colorConversionCache.set(key, result);
    return result;
}

/**
 * Convert RGB to CMYK color space
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number[]} Array of [cyan, magenta, yellow, key] values
 */
function rgbToCmyk(r, g, b) {
    const key = `${r},${g},${b}-cmyk`;
    if (colorConversionCache.has(key)) {
        return colorConversionCache.get(key);
    }

    if (r === 0 && g === 0 && b === 0) {
        return [0, 0, 0, 100];
    }

    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = ((1 - r - k) / (1 - k)) * 100;
    const m = ((1 - g - k) / (1 - k)) * 100;
    const y = ((1 - b - k) / (1 - k)) * 100;

    const result = [c, m, y, k * 100];
    colorConversionCache.set(key, result);
    return result;
}

/**
 * Color history management
 */
const colorHistory = {
    maxSize: 10,
    colors: [],
    
    /**
     * Add a color to history
     * @param {string} color - Hex color code
     */
    add(color) {
        this.colors = this.colors.filter(c => c !== color);
        this.colors.unshift(color);
        if (this.colors.length > this.maxSize) {
            this.colors.pop();
        }
        this.updateUI();
    },
    
    /**
     * Update the color history UI
     */
    updateUI() {
        const container = document.getElementById('colorHistory');
        if (container) {
            container.innerHTML = this.colors.map(color => `
                <div class="color-history-item" 
                     style="background-color: ${color}"
                     onclick="selectColor('${color}')"
                     title="${color}"
                     role="button"
                     aria-label="Select color ${color}">
                </div>
            `).join('');
        }
    }
};

// Export utilities
export {
    hexToRgb,
    rgbToHsl,
    rgbToHsv,
    rgbToCmyk,
    colorHistory
}; 