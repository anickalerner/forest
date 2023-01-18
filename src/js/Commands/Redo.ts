import { App } from '../App'
import { Command } from './Command'

export class Redo extends Command {
  constructor(app: App) {
    super(app)
  }

  public execute() {}
}
