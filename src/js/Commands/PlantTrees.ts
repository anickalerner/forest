import { App } from '../App'
import { Command } from './Command'

export class PlantTrees extends Command {
  app: App
  texture: HTMLImageElement
  constructor(app: App, texture: HTMLImageElement) {
    super(app)
    this.texture = texture
  }
  public execute(): any {
    this.app.forest.placeTree(this.texture)
  }
}
