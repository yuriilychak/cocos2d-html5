import type { AttributeName, VertexAttribute } from "../enums";
import { checkGLErrorDebug } from "../platform/macro/utils";
import GLProgram from "./gl-program";

export type AttributeBinding = readonly [AttributeName, VertexAttribute];
export type ShaderProgram = GLProgram;

export default class ShaderDefinition {
    readonly #vertexShader: string;
    readonly #fragmentShader: string;
    readonly #attributes: AttributeBinding[];

    constructor(
        vertexShader: string,
        fragmentShader: string,
        attributes: AttributeBinding[]
    ) {
        this.#vertexShader = vertexShader;
        this.#fragmentShader = fragmentShader;
        this.#attributes = attributes;
    }

    createProgram(): ShaderProgram {
        const program = new GLProgram();
        program.initWithVertexShaderByteArray(
            this.#vertexShader,
            this.#fragmentShader
        );
        for (const [attributeName, vertexAttribute] of this.#attributes) {
            program.addAttribute(attributeName, vertexAttribute);
        }
        program.link();
        program.updateUniforms();
        checkGLErrorDebug();
        return program;
    }
}
