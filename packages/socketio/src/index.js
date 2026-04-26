// Socket.IO client wrapper for Cocos2d-html5
// This module provides access to socket.io-client functionality

// For environments where socket.io-client is loaded externally (CDN, script tag)
let io;
let loadingPromise = null;

// CDN loading function
function loadSocketIOFromCDN() {
    if (loadingPromise) return loadingPromise;
    
    loadingPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Not in browser environment'));
            return;
        }
        
        // Check if already loaded
        if (window.io) {
            resolve(window.io);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
        script.async = true;
        
        script.onload = () => {
            if (window.io) {
                resolve(window.io);
            } else {
                reject(new Error('Socket.IO failed to load from CDN'));
            }
        };
        
        script.onerror = () => {
            reject(new Error('Failed to load Socket.IO from CDN'));
        };
        
        document.head.appendChild(script);
    });
    
    return loadingPromise;
}

if (typeof window !== 'undefined' && window.io) {
    // Browser environment with socket.io loaded externally
    io = window.io;
} else {
    try {
        // Try to import socket.io-client from npm (Node.js environment)
        const socketIOModule = require('socket.io-client');
        io = socketIOModule.io || socketIOModule.default || socketIOModule;
    } catch (e) {
        // Browser fallback: create stub that throws helpful error
        io = function(url, options) {
            throw new Error('Socket.IO client not loaded. Call SocketIO.loadAsync() first or include socket.io-client library.');
        };
        
        // Add async loading capability
        io.loadAsync = loadSocketIOFromCDN;
    }
}

// Create SocketIO namespace object with connect method (backward compatibility)
const SocketIO = {
    connect: function(url, options) {
        // Always use the current io function directly
        return io(url, options);
    },
    io: function() {
        return io.apply(this, arguments);
    },
    loadAsync: function() {
        return loadSocketIOFromCDN().then((loadedIO) => {
            // Replace the io function with the real one
            io = loadedIO;
            
            // Update global references with the real loaded function
            if (typeof window !== 'undefined') {
                window.io = loadedIO;
                window.SocketIO.io = function() { return loadedIO.apply(this, arguments); };
            }
            if (typeof cc !== 'undefined') {
                cc.io = loadedIO;
                cc.SocketIO.io = function() { return loadedIO.apply(this, arguments); };
            }
            return loadedIO;
        });
    }
};

// Make socket.io available globally for backward compatibility
if (typeof window !== 'undefined') {
    // Only set window.io if it's the actual loaded library, not our wrapper
    if (typeof io === 'function' && !io.loadAsync) {
        window.io = io;
    }
    window.SocketIO = SocketIO;
}

if (typeof global !== 'undefined') {
    if (typeof io === 'function' && !io.loadAsync) {
        global.io = io;
    }
    global.SocketIO = SocketIO;
}

// Cocos2d namespace assignment (backward compatibility)
if (typeof cc !== 'undefined') {
    if (typeof io === 'function' && !io.loadAsync) {
        cc.io = io;
    }
    cc.SocketIO = SocketIO;
}

// ES module export
export { io, SocketIO };
export default io;