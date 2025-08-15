// /src/common/cookie.js

/**
 * Cookie utilities: get, set, delete.
 * Safe for SSR (no-ops server-side).
 */

/**
 * @typedef {Object} CookieOptions
 * @property {Date} [expires]    // Explicit expiration date
 * @property {number} [days]     // Convenience: expires in N days
 * @property {number} [maxAge]   // Max-Age in seconds
 * @property {string} [path]     // Defaults to '/'
 * @property {string} [domain]
 * @property {'Lax'|'Strict'|'None'} [sameSite] // If secure and not set, defaults to 'None'
 * @property {boolean} [secure]  // Adds the Secure attribute
 */

const isBrowser = () => typeof document !== 'undefined';

/**
 * Get a cookie by name.
 * @param {string} name
 * @returns {string|null}
 */
export function getCookie(name) {
    if (!isBrowser()) return null;
    const target = encodeURIComponent(name) + '=';
    const parts = document.cookie ? document.cookie.split('; ') : [];
    for (const part of parts) {
        if (part.startsWith(target)) {
            return decodeURIComponent(part.slice(target.length));
        }
    }
    return null;
}

/**
 * Get all cookies as an object map.
 * @returns {Record<string, string>}
 */
export function getAllCookies() {
    if (!isBrowser()) return {};
    const out = {};
    const parts = document.cookie ? document.cookie.split('; ') : [];
    for (const part of parts) {
        const idx = part.indexOf('=');
        if (idx === -1) continue;
        const key = decodeURIComponent(part.slice(0, idx));
        const val = decodeURIComponent(part.slice(idx + 1));
        out[key] = val;
    }
    return out;
}

/**
 * Set a cookie.
 * @param {string} name
 * @param {string} value
 * @param {CookieOptions} [options]
 */
export function setCookie(name, value, options = {}) {
    if (!isBrowser()) return;

    const encName = encodeURIComponent(name);
    const encValue = encodeURIComponent(value);
    let cookie = `${encName}=${encValue}`;

    if (options.expires instanceof Date) {
        cookie += `; Expires=${options.expires.toUTCString()}`;
    } else if (typeof options.days === 'number') {
        const d = new Date();
        d.setTime(d.getTime() + options.days * 864e5);
        cookie += `; Expires=${d.toUTCString()}`;
    }

    if (typeof options.maxAge === 'number') {
        const d = new Date();
        d.setTime(d.getTime() + options.maxAge * 864e5); // interpret maxAge as days
        // remove any previously set Expires/Max-Age to avoid duplicates
        cookie = cookie.replace(/; (?:Expires|Max-Age)=[^;]*/g, '');
        cookie += `; Expires=${d.toUTCString()}`;
    }

    cookie += `; Path=${options.path || '/'}`;

    if (options.domain) {
        cookie += `; Domain=${options.domain}`;
    }

    const sameSite = options.sameSite || (options.secure ? 'None' : undefined);
    if (sameSite) {
        cookie += `; SameSite=${sameSite}`;
    }

    if (options.secure) {
        cookie += `; Secure`;
    }

    document.cookie = cookie;
}

/**
 * Delete a cookie (must match path/domain used when setting).
 * @param {string} name
 * @param {{ path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax'|'Strict'|'None' }} [options]
 */
export function deleteCookie(name, options = {}) {
    if (!isBrowser()) return;
    setCookie(name, '', {
        ...options,
        expires: new Date(0),
    });
}

export default { getCookie, getAllCookies, setCookie, deleteCookie };