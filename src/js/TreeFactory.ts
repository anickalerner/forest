import { TreeType } from './TreeType'

export class TreeFactory {
  static treeTypes = new Array<TreeType>()

  public static getTreeType(
    name: string,
    color: string,
    texture: HTMLImageElement
  ): TreeType {
    let ind = this.treeTypes.findIndex(
      (tt, i) =>
        tt.name === name && tt.color === color && tt.texture === texture
    )
    if (ind < 0) {
      this.treeTypes.push(new TreeType(name, color, texture))
      ind = -1
    }
    return this.treeTypes.at(ind)
  }
}
