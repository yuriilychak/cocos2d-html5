import type { AttributeName, ShaderName, VertexAttribute } from "../enums";
import type GLProgram from "./gl-program";

export type AttributeBinding = readonly [AttributeName, VertexAttribute];
export type ShaderProgram = GLProgram;

export type NamedUniformLocation = WebGLUniformLocation & { _name?: string };
export type UniformLocationInput = NamedUniformLocation | string | null;
export type ResolvedUniformLocation = WebGLUniformLocation | null | "";
export type UniformMethodArg =
  | number
  | boolean
  | Int32Array
  | Float32Array
  | number[];

export type UniformValueArray = Float32Array | number[];
export type UniformInfo = WebGLActiveInfo & {
  _location: UniformLocationInput;
};
export type UniformCallback = (
  program: GLProgram,
  uniform: UniformInfo
) => void;
export type UniformStoredValue =
  | number
  | UniformValueArray
  | UniformCallback
  | null;

export type ProgramUniform = WebGLActiveInfo & {
  _location: NamedUniformLocation | null;
};
export type UniformSetter =
  | "setInt"
  | "setFloat"
  | "setVec2"
  | "setVec2v"
  | "setVec3"
  | "setVec3v"
  | "setVec4"
  | "setVec4v"
  | "setMat4"
  | "setCallback";

export type TextureLike = {
  renderer: {
    webTexture: WebGLTexture | null;
  };
};
export type CachedTexture = TextureLike | null | -1;

export type DefaultShaderLoadEntry = {
  shaderName: ShaderName;
  isWebGL2Only?: boolean;
};
