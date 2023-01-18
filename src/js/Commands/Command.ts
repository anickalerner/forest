import { App } from '../App'

export abstract class Command {
  app: App
  constructor(app: App) {
    this.app = app
  }

  abstract execute(): any
}
