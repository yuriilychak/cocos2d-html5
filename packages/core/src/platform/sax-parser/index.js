import { SAXParser } from './sax-parser';
import { PlistParser } from './plist-parser';

export { SAXParser, PlistParser };

export const saxParser = new SAXParser();

/**
 * A Plist Parser
 * @type {PlistParser}
 * @name plistParser
 */
export const plistParser = new PlistParser();
