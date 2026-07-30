import { NodeOrder, log } from "@aspect/core";
import { ParticleSystem } from "./particle-system/particle-system";

export class ParticleBatchOrder extends NodeOrder {
  reorderChild(child, zOrder) {
    const batchNode = this.owner;
    if (!child)
      throw new Error("ParticleBatchNode.reorderChild(): child should be non-null");
    if (!(child instanceof ParticleSystem))
      throw new Error("ParticleBatchNode.reorderChild(): only supports QuadParticleSystems as children");
    if (batchNode.children.indexOf(child) === -1) {
      log("ParticleBatchNode.reorderChild(): Child doesn't belong to batch");
      return;
    }

    if (batchNode.children.length > 1) {
      const indexes = batchNode._getCurrentIndex(child, zOrder);
      if (indexes.oldIndex !== indexes.newIndex) {
        batchNode.children.splice(indexes.oldIndex, 1);
        batchNode.children.splice(indexes.newIndex, 0, child);

        const oldAtlasIndex = child.getAtlasIndex();
        batchNode._updateAllAtlasIndexes();

        let newAtlasIndex = 0;
        for (const node of batchNode.children) {
          if (node === child) {
            newAtlasIndex = child.getAtlasIndex();
            break;
          }
        }

        batchNode.textureAtlas.moveQuadsFromIndex(
          oldAtlasIndex,
          child.totalParticles,
          newAtlasIndex
        );
        child.updateWithNoTime();
      }
    }
    child.order.localZOrder = zOrder;
  }
}
