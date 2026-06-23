class CausalFunnelTracker {
    constructor(endpoint = 'http://localhost:3000/api/tracking/events') {
        this.endpoint = endpoint;
        this.queue = [];
        this.isSending = false;
        
        // 1. Initialize Identity
        this.visitorId = this.getOrCreateVisitorId();
        this.fingerprintHash = this.generateFingerprint();

        // 2. Start Batch Queue (Flush every 5 seconds)
        setInterval(() => this.flush(), 5000);

        // 3. Reliable Unload Delivery (Tab close/navigation)
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flush(true); // Forces sendBeacon
            }
        });

        // 4. Auto-track all clicks with Normalized Coordinates
        this.setupGlobalClickTracking();
    }

    // --- Identity Module ---
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
    }

    getOrCreateVisitorId() {
        let vid = this.getCookie('cf_visitor_id');
        if (!vid) {
            vid = 'vid_' + crypto.randomUUID().replace(/-/g, '') + Date.now().toString(36);
            this.setCookie('cf_visitor_id', vid, 365);
        }
        return vid;
    }

    generateFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            window.screen.width,
            window.screen.height,
            Intl.DateTimeFormat().resolvedOptions().timeZone
        ];
        const raw = components.join('|');
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            const char = raw.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; 
        }
        return Math.abs(hash).toString(16);
    }

    // --- Event Collector Module ---
    setupGlobalClickTracking() {
        document.addEventListener('click', (e) => {
            // Normalized Coordinates for Heatmaps!
            const x_percent = (e.clientX / window.innerWidth).toFixed(4);
            const y_percent = (e.clientY / window.innerHeight).toFixed(4);
            
            const element_tag = e.target.tagName;
            const element_text = e.target.innerText ? e.target.innerText.substring(0, 30) : '';

            this.track('click', {
                x: e.clientX,
                y: e.clientY,
                x_percent: parseFloat(x_percent),
                y_percent: parseFloat(y_percent),
                element_tag,
                element_text
            });
        });
    }

    track(eventType, metadata = {}) {
        // Core Schema (Root Level Optimization applied here)
        const event = {
            event_id: 'evt_' + crypto.randomUUID().replace(/-/g, ''),
            schema_version: 1,
            visitor_id: this.visitorId,
            fingerprint_hash: this.fingerprintHash,
            event_type: eventType,
            page_url: window.location.pathname, // Root level for faster DB indexing
            timestamp: new Date().toISOString(),
            metadata: {
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight,
                ...metadata // Spreads specific event data (like product_id)
            }
        };
        
        this.queue.push(event);

        // Force flush if queue gets too large to prevent data loss
        if (this.queue.length >= 10) {
            this.flush();
        }
    }

    // --- Transport & Retry Module ---
    async flush(isUnload = false) {
        if (this.queue.length === 0 || this.isSending) return;

        const batch = [...this.queue];
        this.queue = []; 
        
        const payload = JSON.stringify({ events: batch });

        if (isUnload && navigator.sendBeacon) {
            navigator.sendBeacon(this.endpoint, payload);
        } else {
            this.isSending = true;
            try {
                const response = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                });
                if (!response.ok) throw new Error('Analytics batch rejected by server');
            } catch (error) {
                console.warn('Analytics batch failed, placing back in queue');
                this.queue = [...batch, ...this.queue]; // Put back on failure
            } finally {
                this.isSending = false;
            }
        }
    }
}

export const tracker = new CausalFunnelTracker();