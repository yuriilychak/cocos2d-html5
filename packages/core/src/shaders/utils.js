/**
 * <p>
 *     Sets the shader program for this node
 *
 *     Since v2.0, each rendering node must set its shader program.
 *     It should be set in initialize phase.
 * </p>
 * @function
 * @param {Node} node
 * @param {GLProgram} program The shader program which fetches from CCShaderCache.
 * @example
 * setGLProgram(node, shaderCache.programForKey(SHADER_POSITION_TEXTURECOLOR));
 */
export function setProgramForNode(node, program) {
  node.shaderProgram = program;

  let children = node.children;
  if (!children) return;

  for (let i = 0; i < children.length; i++) setProgramForNode(children[i], program);
}
