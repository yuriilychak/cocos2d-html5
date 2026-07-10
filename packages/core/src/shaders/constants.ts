import { AttributeName, ShaderName, VertexAttribute } from "../enums";
import {
    SHADER_POSITION,
    SHADER_SPRITE,
    buildSpriteMultiTextureVert
} from "./shaders";
import ShaderDefinition from "./shader-definition";

export function createDefaultShaderDefinitions(
    multiTextureFragmentShader: string
): Map<ShaderName, ShaderDefinition> {
    return new Map<ShaderName, ShaderDefinition>([
        [
            ShaderName.POSITION_TEXTURECOLOR,
            new ShaderDefinition(
                SHADER_POSITION.TEXTURE_COLOR_VERT,
                SHADER_POSITION.TEXTURE_COLOR_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.POSITION_TEXTURECOLORALPHATEST,
            new ShaderDefinition(
                SHADER_POSITION.TEXTURE_COLOR_VERT,
                SHADER_POSITION.TEXTURE_COLOR_ALPHATEST_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.POSITION_COLOR,
            new ShaderDefinition(
                SHADER_POSITION.COLOR_VERT,
                SHADER_POSITION.COLOR_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR]
                ]
            )
        ],
        [
            ShaderName.POSITION_TEXTURE,
            new ShaderDefinition(
                SHADER_POSITION.TEXTURE_VERT,
                SHADER_POSITION.TEXTURE_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.POSITION_TEXTURE_UCOLOR,
            new ShaderDefinition(
                SHADER_POSITION.TEXTURE_UCOLOR_VERT,
                SHADER_POSITION.TEXTURE_UCOLOR_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.POSITION_TEXTUREA8COLOR,
            new ShaderDefinition(
                SHADER_POSITION.TEXTURE_A8COLOR_VERT,
                SHADER_POSITION.TEXTURE_A8COLOR_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.POSITION_UCOLOR,
            new ShaderDefinition(
                SHADER_POSITION.UCOLOR_VERT,
                SHADER_POSITION.UCOLOR_FRAG,
                [[AttributeName.VERTEX, VertexAttribute.POSITION]]
            )
        ],
        [
            ShaderName.POSITION_LENGTHTEXTURECOLOR,
            new ShaderDefinition(
                SHADER_POSITION.COLOR_LENGTH_TEXTURE_VERT,
                SHADER_POSITION.COLOR_LENGTH_TEXTURE_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS],
                    [AttributeName.COLOR, VertexAttribute.COLOR]
                ]
            )
        ],
        [
            ShaderName.SPRITE_POSITION_TEXTURECOLOR,
            new ShaderDefinition(
                SHADER_SPRITE.POSITION_TEXTURE_COLOR_VERT,
                SHADER_POSITION.TEXTURE_COLOR_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.SPRITE_POSITION_TEXTURECOLOR_MULTI,
            new ShaderDefinition(
                buildSpriteMultiTextureVert(),
                multiTextureFragmentShader,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS],
                    [AttributeName.TEX_INDEX, VertexAttribute.TEX_INDEX]
                ]
            )
        ],
        [
            ShaderName.SPRITE_POSITION_TEXTURECOLORALPHATEST,
            new ShaderDefinition(
                SHADER_SPRITE.POSITION_TEXTURE_COLOR_VERT,
                SHADER_POSITION.TEXTURE_COLOR_ALPHATEST_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ],
        [
            ShaderName.SPRITE_POSITION_COLOR,
            new ShaderDefinition(
                SHADER_SPRITE.POSITION_COLOR_VERT,
                SHADER_POSITION.COLOR_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR]
                ]
            )
        ],
        [
            ShaderName.SPRITE_POSITION_TEXTURECOLOR_GRAY,
            new ShaderDefinition(
                SHADER_SPRITE.POSITION_TEXTURE_COLOR_VERT,
                SHADER_SPRITE.POSITION_TEXTURE_COLOR_GRAY_FRAG,
                [
                    [AttributeName.POSITION, VertexAttribute.POSITION],
                    [AttributeName.COLOR, VertexAttribute.COLOR],
                    [AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS]
                ]
            )
        ]
    ]);
}

export const defaultShaderLoadList: readonly {
    shaderName: ShaderName;
    isWebGL2Only?: boolean;
}[] = [
    { shaderName: ShaderName.POSITION_TEXTURECOLOR },
    { shaderName: ShaderName.POSITION_TEXTURECOLORALPHATEST },
    { shaderName: ShaderName.POSITION_COLOR },
    { shaderName: ShaderName.POSITION_TEXTURE },
    { shaderName: ShaderName.POSITION_TEXTURE_UCOLOR },
    { shaderName: ShaderName.POSITION_TEXTUREA8COLOR },
    { shaderName: ShaderName.POSITION_UCOLOR },
    { shaderName: ShaderName.POSITION_LENGTHTEXTURECOLOR },
    { shaderName: ShaderName.SPRITE_POSITION_TEXTURECOLOR },
    {
        shaderName: ShaderName.SPRITE_POSITION_TEXTURECOLOR_MULTI,
        isWebGL2Only: true
    },
    { shaderName: ShaderName.SPRITE_POSITION_TEXTURECOLORALPHATEST },
    { shaderName: ShaderName.SPRITE_POSITION_COLOR },
    { shaderName: ShaderName.SPRITE_POSITION_TEXTURECOLOR_GRAY }
];
