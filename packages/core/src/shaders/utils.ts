import type { ShaderProgram } from "./types";

type ShaderNodeLike = {
  shaderProgram: ShaderProgram;
  children?: ShaderNodeLike[] | null;
};

/**
 * Sets the shader program for this node and all descendants.
 *
 * Since v2.0, each rendering node must set its shader program during
 * initialization.
 */
export function setProgramForNode(
  node: ShaderNodeLike,
  program: ShaderProgram
): void {
  node.shaderProgram = program;

  const children = node.children;
  if (!children) {
    return;
  }

  for (let i = 0; i < children.length; i++) {
    setProgramForNode(children[i], program);
  }
}
