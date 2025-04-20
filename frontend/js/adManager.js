/**
 * Ad Manager for ColorPeek
 * Handles loading and displaying ads across different placements
 */

class AdManager {
    constructor() {
        // Ad slot IDs - Replace these with your actual AdSense ad unit IDs
        this.adSlots = {
            topBanner: 'your-top-banner-id',
            rightSidebar: 'your-right-sidebar-id',
            leftSidebar: 'your-left-sidebar-id',
            inContent1: 'your-in-content-1-id',
            inContent2: 'your-in-content-2-id',
            inContent3: 'your-in-content-3-id',
            inContent4: 'your-in-content-4-id',
            inContent5: 'your-in-content-5-id'
        };
    }

    /**
     * Initialize AdSense code
     */
    initAds() {
        // Add Google AdSense script
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        adScript.setAttribute('data-ad-client', 'your-adsense-publisher-id'); // Replace with your AdSense publisher ID
        document.head.appendChild(adScript);

        // Initialize all ad slots
        this.initializeAdSlots();
    }

    /**
     * Initialize all ad slots in the page
     */
    initializeAdSlots() {
        // Initialize each ad placement
        Object.keys(this.adSlots).forEach(slotKey => {
            const adContainer = document.getElementById(`${slotKey}-ad`);
            if (adContainer) {
                this.createAdSlot(adContainer, this.adSlots[slotKey]);
            }
        });
    }

    /**
     * Create an individual ad slot
     * @param {HTMLElement} container - The container element for the ad
     * @param {string} adUnitId - The AdSense ad unit ID
     */
    createAdSlot(container, adUnitId) {
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', 'your-adsense-publisher-id'); // Replace with your publisher ID
        ins.setAttribute('data-ad-slot', adUnitId);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');
        
        container.appendChild(ins);
        
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('Error loading ad:', error);
            this.handleAdError(container);
        }
    }

    /**
     * Handle ad loading errors
     * @param {HTMLElement} container - The container element for the ad
     */
    handleAdError(container) {
        container.innerHTML = '<div class="ad-error">Advertisement</div>';
    }

    /**
     * Refresh all ads on the page
     */
    refreshAds() {
        if (window.adsbygoogle && window.adsbygoogle.push) {
            Object.keys(this.adSlots).forEach(() => {
                (adsbygoogle = window.adsbygoogle || []).push({});
            });
        }
    }
}

// Export the AdManager
export default AdManager; 