/**
 * Check the obj whether is function or not
 */
export function isFunction(obj: unknown): obj is Function {
    return typeof obj === 'function';
}

/**
 * Check the obj whether is number or not
 */
export function isNumber(obj: unknown): obj is number {
    return typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]';
}

/**
 * Check the obj whether is string or not
 */
export function isString(obj: unknown): obj is string {
    return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
}

/**
 * Check the obj whether is array or not
 */
export function isArray(obj: unknown): obj is unknown[] {
    return Array.isArray(obj) ||
        (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
}

/**
 * Check the obj whether is undefined or not
 */
export function isUndefined(obj: unknown): obj is undefined {
    return typeof obj === 'undefined';
}

/**
 * Check the obj whether is object or not
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Check the url whether cross origin
 */
export function isCrossOrigin(url: string): boolean {
    const startIndex = url.indexOf("://");
    if (startIndex === -1)
        return false;

    const endIndex = url.indexOf("/", startIndex + 3);
    const urlOrigin = (endIndex === -1) ? url : url.substring(0, endIndex);

    return urlOrigin !== location.origin;
}

/**
 * A string tool to construct a string with format string.
 * @example
 *      formatStr("a: %d, b: %b", a, b);
 *      formatStr(a, b, c);
 */
export function formatStr(template: unknown, ...args: any[]): string {
    let result = String(template);
    const shouldFormat = typeof template !== "object";

    for (const arg of args) {
        const placeholder = typeof arg === "number" ? /(%d)|(%s)/ : /%s/;

        result = shouldFormat && placeholder.test(result) 
            ? result.replace(placeholder, String(arg)) 
            : `${result}    ${arg}`;
    }

    return result;
}
