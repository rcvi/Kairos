(function() {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (['visibilitychange', 'blur', 'resize'].includes(type)) {
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    Object.defineProperty(document, 'fullscreenElement', {
        get: () => document.documentElement,
        configurable: true
    });
    Object.defineProperty(document, 'webkitFullscreenElement', {
        get: () => document.documentElement,
        configurable: true
    });
    Object.defineProperty(document, 'fullscreenEnabled', {
        get: () => true,
        configurable: true
    });

    Element.prototype.requestFullscreen = function() {
        return new Promise((resolve) => {
            document.dispatchEvent(new Event('fullscreenchange'));
            resolve();
        });
    };

    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        if (callback && callback.toString().includes('idleSeconds')) {
            return -1;
        }
        return originalSetInterval.call(this, callback, delay, ...args);
    };

    document.addEventListener('paste', (e) => {
        e.stopImmediatePropagation();
    }, true);
})();