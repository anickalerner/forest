import { App } from '../App'
import { Command } from './Command'

export class ClearForest extends Command {
  app: App
  constructor(app: App) {
    super(app)
  }
  public execute(): any {
    this.app.forest.clearForest()
  }
}
