export enum Language {
  ENGLISH = "en",
  CHINESE = "zh",
  FRENCH = "fr",
  ITALIAN = "it",
  GERMAN = "de",
  SPANISH = "es",
  DUTCH = "du",
  RUSSIAN = "ru",
  KOREAN = "ko",
  JAPANESE = "ja",
  HUNGARIAN = "hu",
  PORTUGUESE = "pt",
  ARABIC = "ar",
  NORWEGIAN = "no",
  POLISH = "pl",
  UNKNOWN = "unkonwn"
}

export enum OperatingSystem {
  IOS = "iOS",
  ANDROID = "Android",
  WINDOWS = "Windows",
  MARMALADE = "Marmalade",
  LINUX = "Linux",
  BADA = "Bada",
  BLACKBERRY = "Blackberry",
  OSX = "OS X",
  WP8 = "WP8",
  WINRT = "WINRT",
  UNKNOWN = "Unknown"
}

export enum Platform {
  UNKNOWN = -1,
  WIN32 = 0,
  LINUX = 1,
  MACOS = 2,
  ANDROID = 3,
  IPHONE = 4,
  IPAD = 5,
  BLACKBERRY = 6,
  NACL = 7,
  EMSCRIPTEN = 8,
  TIZEN = 9,
  WINRT = 10,
  WP8 = 11,
  MOBILE_BROWSER = 100,
  DESKTOP_BROWSER = 101
}

export enum BrowserType {
  WECHAT = "wechat",
  ANDROID = "androidbrowser",
  IE = "ie",
  QQ_APP = "qq",
  QQ = "qqbrowser",
  MOBILE_QQ = "mqqbrowser",
  UC = "ucbrowser",
  BROWSER_360 = "360browser",
  BAIDU_APP = "baiduboxapp",
  BAIDU = "baidubrowser",
  MAXTHON = "maxthon",
  OPERA = "opera",
  OUPENG = "oupeng",
  MIUI = "miuibrowser",
  FIREFOX = "firefox",
  SAFARI = "safari",
  CHROME = "chrome",
  LIEBAO = "liebao",
  QZONE = "qzone",
  SOUGOU = "sogou",
  UNKNOWN = "unknown"
}

export enum TextAlignment {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2
}

export enum VerticalTextAlignment {
  TOP = 0,
  CENTER = 1,
  BOTTOM = 2
}

export enum DebugMode {
  NONE = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  INFO_FOR_WEB_PAGE = 4,
  WARN_FOR_WEB_PAGE = 5,
  ERROR_FOR_WEB_PAGE = 6
}

export enum GameEvent {
  HIDE = "game_on_hide",
  SHOW = "game_on_show",
  RESIZE = "game_on_resize",
  RENDERER_INITED = "renderer_inited"
}

export enum RenderType {
  CANVAS = 0,
  WEBGL = 1,
  OPENGL = 2
}

export enum DensityDPI {
  DEVICE = "device-dpi",
  HIGH = "high-dpi",
  MEDIUM = "medium-dpi",
  LOW = "low-dpi"
}

export enum ResolutionPolicyType {
  EXACT_FIT = 0,
  NO_BORDER = 1,
  SHOW_ALL = 2,
  FIXED_HEIGHT = 3,
  FIXED_WIDTH = 4,
  UNKNOWN = 5
}

export enum GLState {
  ONE = 1,
  ZERO = 0,
  SRC_ALPHA = 0x0302,
  SRC_ALPHA_SATURATE = 0x308,
  SRC_COLOR = 0x300,
  DST_ALPHA = 0x304,
  DST_COLOR = 0x306,
  ONE_MINUS_SRC_ALPHA = 0x0303,
  ONE_MINUS_SRC_COLOR = 0x301,
  ONE_MINUS_DST_ALPHA = 0x305,
  ONE_MINUS_DST_COLOR = 0x0307,
  ONE_MINUS_CONSTANT_ALPHA = 0x8004,
  ONE_MINUS_CONSTANT_COLOR = 0x8002,
  LINEAR = 0x2601,
  REPEAT = 0x2901,
  CLAMP_TO_EDGE = 0x812f,
  MIRRORED_REPEAT = 0x8370,
  BLEND_SRC = SRC_ALPHA,
  BLEND_DST = ONE_MINUS_SRC_ALPHA
}

export enum DeviceOrientation {
  PORTRAIT = 1,
  LANDSCAPE = 2,
  AUTO = 3
}

export enum VertexAttribFlag {
  NONE = 0,
  POSITION = 1 << 0,
  COLOR = 1 << 1,
  TEX_COORDS = 1 << 2,
  POS_COLOR_TEX = POSITION | COLOR | TEX_COORDS
}

export enum GLServerState {
  ALL = 0
}

export enum VertexAttribute {
  POSITION = 0,
  COLOR = 1,
  TEX_COORDS = 2,
  TEX_INDEX = 3,
  MAX = 7
}

export enum Uniform {
  PMATRIX = 0,
  MVMATRIX = 1,
  MVPMATRIX = 2,
  TIME = 3,
  SINTIME = 4,
  COSTIME = 5,
  RANDOM01 = 6,
  SAMPLER = 7,
  MAX = 8
}

export enum ShaderName {
  POSITION_TEXTURECOLOR = "ShaderPositionTextureColor",
  SPRITE_POSITION_TEXTURECOLOR = "ShaderSpritePositionTextureColor",
  SPRITE_POSITION_TEXTURECOLOR_MULTI = "ShaderSpritePositionTextureColorMulti",
  SPRITE_POSITION_TEXTURECOLOR_GRAY = "ShaderSpritePositionTextureColorGray",
  POSITION_TEXTURECOLORALPHATEST = "ShaderPositionTextureColorAlphaTest",
  SPRITE_POSITION_TEXTURECOLORALPHATEST = "ShaderSpritePositionTextureColorAlphaTest",
  POSITION_COLOR = "ShaderPositionColor",
  SPRITE_POSITION_COLOR = "ShaderSpritePositionColor",
  POSITION_TEXTURE = "ShaderPositionTexture",
  POSITION_TEXTURE_UCOLOR = "ShaderPositionTextureUColor",
  POSITION_TEXTUREA8COLOR = "ShaderPositionTextureA8Color",
  POSITION_UCOLOR = "ShaderPositionUColor",
  POSITION_LENGTHTEXTURECOLOR = "ShaderPositionLengthTextureColor"
}

export enum UniformName {
  PMATRIX = "CC_PMatrix",
  MVMATRIX = "CC_MVMatrix",
  MVPMATRIX = "CC_MVPMatrix",
  TIME = "CC_Time",
  SINTIME = "CC_SinTime",
  COSTIME = "CC_CosTime",
  RANDOM01 = "CC_Random01",
  SAMPLER = "CC_Texture0",
  ALPHA_TEST_VALUE = "CC_alpha_value"
}

export enum AttributeName {
  COLOR = "a_color",
  POSITION = "a_position",
  TEX_COORD = "a_texCoord",
  TEX_INDEX = "a_texIndex",
  MVMAT = "a_mvMatrix"
}

export enum DirectorEvent {
  PROJECTION_CHANGED = "director_projection_changed",
  AFTER_UPDATE = "director_after_update",
  AFTER_VISIT = "director_after_visit",
  AFTER_DRAW = "director_after_draw"
}

export enum DirectorProjection {
  TWO_D = 0,
  THREE_D = 1,
  CUSTOM = 3,
  DEFAULT = THREE_D
}

export enum EventType {
  NONE = -1,
  TOUCH = 0,
  KEYBOARD = 1,
  ACCELERATION = 2,
  MOUSE = 3,
  FOCUS = 4,
  CUSTOM = 6
}

export enum MouseEvent {
  /**
   * The none event code of  mouse event.
   */
  NONE = 0,
  /**
   * The event type code of mouse down event.
   */
  DOWN = 1,
  /**
   * The event type code of mouse up event.
   */
  UP = 2,
  /**
   * The event type code of mouse move event.
   */
  MOVE = 3,
  /**
   * The event type code of mouse scroll event.
   */
  SCROLL = 4
}

export enum MouseButton {
  /**
   * The tag of Mouse left button
   */
  LEFT = 0,

  /**
   * The tag of Mouse right button  (The right button number is 2 on browser)
   */
  RIGHT = 2,

  /**
   * The tag of Mouse middle button  (The right button number is 1 on browser)
   */
  MIDDLE = 1,

  /**
   * The tag of Mouse button 4
   */
  B4 = 3,

  /**
   * The tag of Mouse button 5
   */
  B5 = 4,

  /**
   * The tag of Mouse button 6
   */
  B6 = 5,

  /**
   * The tag of Mouse button 7
   */
  B7 = 6,

  /**
   * The tag of Mouse button 8
   */
  B8 = 7
}

export enum TouchEvent {
    NONE = -1,
    BEGAN = 0, 
    MOVED = 1, 
    ENDED = 2, 
    CANCELLED = 3
}