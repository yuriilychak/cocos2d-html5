/**
 * Utilities for manipulating paths and URLs.
 */
export default class Path {
  static normalizeRE: RegExp = /[^\.\/]+\/\.\.\//;

  /**
   * Join strings to be a path.
   */
  public static join(...args: string[]): string {
    let result = "";
    for (let i = 0; i < args.length; i++) {
      result = (result + (result === "" ? "" : "/") + args[i]).replace(/(\/|\\\\)$/, "");
    }
    return result;
  }

  /**
   * Get the extension name of a path.
   */
  public static extname(pathStr: string): string | null {
    const temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
    return temp ? temp[1] : null;
  }

  /**
   * Get the main name of a file name.
   */
  public static mainFileName(fileName: string): string {
    if (fileName) {
      const idx = fileName.lastIndexOf(".");
      if (idx !== -1) return fileName.substring(0, idx);
    }
    return fileName;
  }

  /**
   * Get the file name of a file path.
   */
  public static basename(pathStr: string, extname?: string): string | null {
    const index = pathStr.indexOf("?");
    if (index > 0) pathStr = pathStr.substring(0, index);
    const reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
    const result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
    if (!result) return null;
    const baseName = result[2];
    if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase()) {
      return baseName.substring(0, baseName.length - extname.length);
    }
    return baseName;
  }

  /**
   * Get the directory name of a file path.
   */
  public static dirname(pathStr: string): string {
    return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, "$2");
  }

  /**
   * Change the extension name of a file path.
   */
  public static changeExtname(pathStr: string, extname?: string): string {
    extname = extname || "";
    let index = pathStr.indexOf("?");
    let tempStr = "";
    if (index > 0) {
      tempStr = pathStr.substring(index);
      pathStr = pathStr.substring(0, index);
    }
    index = pathStr.lastIndexOf(".");
    if (index < 0) return pathStr + extname + tempStr;
    return pathStr.substring(0, index) + extname + tempStr;
  }

  /**
   * Change the file name of a file path.
   */
  public static changeBasename(pathStr: string, basename: string, isSameExt = false): string {
    if (basename.indexOf(".") === 0) return Path.changeExtname(pathStr, basename);
    let index = pathStr.indexOf("?");
    let tempStr = "";
    const ext: string | null = isSameExt ? Path.extname(pathStr) : "";
    if (index > 0) {
      tempStr = pathStr.substring(index);
      pathStr = pathStr.substring(0, index);
    }
    index = pathStr.lastIndexOf("/");
    index = index <= 0 ? 0 : index + 1;
    return pathStr.substring(0, index) + basename + ext + tempStr;
  }

  // TODO: make public after verification.
  public static _normalize(url: unknown): string {
    let oldUrl: string;
    let normalizedUrl = String(url);

    do {
      oldUrl = normalizedUrl;
      normalizedUrl = normalizedUrl.replace(Path.normalizeRE, "");
    } while (oldUrl.length !== normalizedUrl.length);
    return normalizedUrl;
  }
}
