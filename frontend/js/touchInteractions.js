/**
 * Mobile touch interactions for color picker
 * @module touchInteractions
 */

/**
 * Initialize touch events for color picker
 * @param {Function} onColorPick - Callback function when color is picked
 */
export function initTouchColorPicker(onColorPick) {
    const mainImageContainer = document.getElementById('mainImageContainer');
    const magnifier = document.getElementById('magnifier');
    const liveColorPreview = document.getElementById('liveColorPreview');
    
    let touchTimeout;
    let isLongPress = false;
    
    // Prevent default touch behaviors
    mainImageContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return; // Ignore multi-touch
        
        const touch = e.touches[0];
        isLongPress = false;
        
        touchTimeout = setTimeout(() => {
            isLongPress = true;
            showColorPickerUI(touch.clientX, touch.clientY);
        }, 500);
    }, { passive: false });
    
    mainImageContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) return;
        
        const touch = e.touches[0];
        if (isLongPress) {
            e.preventDefault(); // Prevent scrolling during color picking
            updateColorPickerUI(touch.clientX, touch.clientY);
        }
    }, { passive: false });
    
    mainImageContainer.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
        if (isLongPress) {
            hideMagnifier();
        }
    });
    
    function showColorPickerUI(clientX, clientY) {
        const rect = mainImageContainer.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // Show magnifier
        if (magnifier) {
            magnifier.style.left = `${x + 20}px`;
            magnifier.style.top = `${y + 20}px`;
            magnifier.classList.remove('hidden');
        }
        
        // Show live color preview
        if (liveColorPreview) {
            liveColorPreview.style.left = `${x + 30}px`;
            liveColorPreview.style.top = `${y + 150}px`;
            liveColorPreview.classList.remove('hidden');
        }
        
        // Use existing color picking logic
        updateColorPickerUI(clientX, clientY);
    }
    
    function updateColorPickerUI(clientX, clientY) {
        const rect = mainImageContainer.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // Update magnifier position
        if (magnifier) {
            magnifier.style.left = `${x + 20}px`;
            magnifier.style.top = `${y + 20}px`;
        }
        
        // Update live color preview position
        if (liveColorPreview) {
            const previewX = Math.min(x + 30, window.innerWidth - 150);
            const previewY = Math.min(y + 150, window.innerHeight - 60);
            liveColorPreview.style.left = `${previewX}px`;
            liveColorPreview.style.top = `${previewY}px`;
        }
        
        // Call the color pick callback
        if (onColorPick) {
            onColorPick(x, y);
        }
    }
    
    function hideMagnifier() {
        if (magnifier) {
            magnifier.classList.add('hidden');
        }
        if (liveColorPreview) {
            liveColorPreview.classList.add('hidden');
        }
    }
    
    // Add pinch-to-zoom functionality
    let initialDistance = 0;
    let currentScale = 1;
    
    mainImageContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = getTouchDistance(e.touches);
        }
    });
    
    mainImageContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getTouchDistance(e.touches);
            const scale = currentDistance / initialDistance;
            
            // Limit scale between 0.5 and 3
            currentScale = Math.min(Math.max(0.5, currentScale * scale), 3);
            
            const image = mainImageContainer.querySelector('img');
            if (image) {
                image.style.transform = `scale(${currentScale})`;
            }
            
            initialDistance = currentDistance;
        }
    });
    
    function getTouchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }
}

// Export touch interaction utilities
export default {
    initTouchColorPicker
}; 