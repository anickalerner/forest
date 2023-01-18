import { Forest } from './Forest'
import { ForestPainter } from './ForestPainer'
import { GUIHandler } from './GUIHandler'
import { Tree } from './Tree'

export class App {
  forest: Forest
  forestPainter: ForestPainter
  gui: GUIHandler

  constructor() {
    this.forestPainter = new ForestPainter(
      <HTMLCanvasElement>document.getElementById('forest')
    )
    this.gui = new GUIHandler(this)
    this.forest = new Forest(10, 10, this.forestPainter, this.gui)
  }

  public undo() {}

  public redo() {}
}
