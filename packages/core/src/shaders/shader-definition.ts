import type { AttributeName, VertexAttribute } from "../enums";
import { checkGLErrorDebug } from "../platform/macro/utils";
import GLProgram from "./CCGLProgram";

export type AttributeBinding = readonly [AttributeName, VertexAttribute];
export type ShaderProgram = InstanceType<typeof GLProgram>;

export default class ShaderDefinition {
    readonly #vertexShader: string;
    #fragmentShader: string;
    readonly #attributes: readonly AttributeBinding[];

    constructor(
        vertexShader: string,
        fragmentShader: string,
        attributes: readonly AttributeBinding[]
    ) {
        this.#vertexShader = vertexShader;
        this.#fragmentShader = fragmentShader;
        this.#attributes = attributes;
    }

    createProgram(): ShaderProgram {
        const program = new (GLProgram as unknown as { new (): ShaderProgram })();
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
