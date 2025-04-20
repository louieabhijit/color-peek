/**
 * Tests for color utilities
 */

import { hexToRgb, rgbToHsl, rgbToHsv, rgbToCmyk } from '../colorUtils.js';

// Test suite for hexToRgb
function testHexToRgb() {
    console.log('Testing hexToRgb...');
    
    // Test cases
    const tests = [
        { input: '#FFFFFF', expected: [255, 255, 255] },
        { input: '#000000', expected: [0, 0, 0] },
        { input: '#FF0000', expected: [255, 0, 0] },
        { input: '#00FF00', expected: [0, 255, 0] },
        { input: '#0000FF', expected: [0, 0, 255] },
        { input: '#FFF', expected: [255, 255, 255] }, // Short form
    ];
    
    tests.forEach(test => {
        const result = hexToRgb(test.input);
        const passed = arraysEqual(result, test.expected);
        console.log(`${test.input} -> RGB(${result}): ${passed ? '✓' : '✗'}`);
    });
}

// Test suite for rgbToHsl
function testRgbToHsl() {
    console.log('\nTesting rgbToHsl...');
    
    // Test cases
    const tests = [
        { input: [255, 255, 255], expected: [0, 0, 100] },
        { input: [0, 0, 0], expected: [0, 0, 0] },
        { input: [255, 0, 0], expected: [0, 100, 50] },
        { input: [0, 255, 0], expected: [120, 100, 50] },
        { input: [0, 0, 255], expected: [240, 100, 50] },
    ];
    
    tests.forEach(test => {
        const result = rgbToHsl(...test.input);
        const passed = arraysEqual(
            result.map(Math.round),
            test.expected.map(Math.round)
        );
        console.log(`RGB(${test.input}) -> HSL(${result}): ${passed ? '✓' : '✗'}`);
    });
}

// Test suite for rgbToHsv
function testRgbToHsv() {
    console.log('\nTesting rgbToHsv...');
    
    // Test cases
    const tests = [
        { input: [255, 255, 255], expected: [0, 0, 100] },
        { input: [0, 0, 0], expected: [0, 0, 0] },
        { input: [255, 0, 0], expected: [0, 100, 100] },
        { input: [0, 255, 0], expected: [120, 100, 100] },
        { input: [0, 0, 255], expected: [240, 100, 100] },
    ];
    
    tests.forEach(test => {
        const result = rgbToHsv(...test.input);
        const passed = arraysEqual(
            result.map(Math.round),
            test.expected.map(Math.round)
        );
        console.log(`RGB(${test.input}) -> HSV(${result}): ${passed ? '✓' : '✗'}`);
    });
}

// Test suite for rgbToCmyk
function testRgbToCmyk() {
    console.log('\nTesting rgbToCmyk...');
    
    // Test cases
    const tests = [
        { input: [255, 255, 255], expected: [0, 0, 0, 0] },
        { input: [0, 0, 0], expected: [0, 0, 0, 100] },
        { input: [255, 0, 0], expected: [0, 100, 100, 0] },
        { input: [0, 255, 0], expected: [100, 0, 100, 0] },
        { input: [0, 0, 255], expected: [100, 100, 0, 0] },
    ];
    
    tests.forEach(test => {
        const result = rgbToCmyk(...test.input);
        const passed = arraysEqual(
            result.map(Math.round),
            test.expected.map(Math.round)
        );
        console.log(`RGB(${test.input}) -> CMYK(${result}): ${passed ? '✓' : '✗'}`);
    });
}

// Helper function to compare arrays
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => Math.abs(val - b[index]) < 0.01);
}

// Run all tests
console.log('Running color utility tests...\n');
testHexToRgb();
testRgbToHsl();
testRgbToHsv();
testRgbToCmyk();
console.log('\nTests completed.'); 