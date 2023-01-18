import { TreeType } from './TreeType'
import { TreeFactory } from './TreeFactory'
import { Coords } from './Coords'

export class Tree {
  coords: Coords
  type: TreeType

  constructor(
    coords: Coords,
    name: string,
    color: string,
    texture: HTMLImageElement
  ) {
    this.coords = coords
    this.type = TreeFactory.getTreeType(name, color, texture)
  }
  public draw(context: CanvasRenderingContext2D) {
    this.type.draw(context, this.coords.x, this.coords.y)
  }
}
