import { App } from '../App'
import { Command } from './Command'

export class Undo extends Command {
  constructor(app: App) {
    super(app)
  }

  public execute() {
    this.app.forest.undo()
  }
}
