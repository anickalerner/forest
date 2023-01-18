import { App } from './App'
import { ClearForest } from './Commands/ClearForest'
import { Command } from './Commands/Command'
import { PlantTrees } from './Commands/PlantTrees'
import { Toast } from 'bootstrap'
import { Undo } from './Commands/Undo'
import { Redo } from './Commands/Redo'

export class GUIHandler {
  app: App
  trees: HTMLCollectionOf<HTMLElement>
  clearButton: HTMLButtonElement
  constructor(app: App) {
    this.app = app
    this.init()
  }
  init() {
    this.trees = document.getElementsByClassName(
      'treeIcon'
    ) as HTMLCollectionOf<HTMLElement>

    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].addEventListener('click', e => this.plantTrees(e))
    }
    this.setClearButton()
    this.setUndoRedoButtons()
  }

  public setClearButton() {
    this.clearButton = document.getElementById(
      'clear-forest'
    ) as HTMLButtonElement
    this.clearButton.addEventListener('click', () => {
      this.clearForest()
      this.clearButton.classList.add('d-none')
    })
  }

  public setUndoRedoButtons() {
    let undoButon = document.getElementById('undoBtn') as HTMLElement
    let redoButon = document.getElementById('redoBtn') as HTMLElement
    undoButon.addEventListener('click', () => {
      console.log('undo clicked')
      this.executeCommand(new Undo(this.app))
    })
    redoButon.addEventListener('click', () => {
      this.executeCommand(new Redo(this.app))
    })
  }

  public showClearButton() {
    this.clearButton.classList.remove('d-none')
    this.showFullForestMessage()
  }

  public executeCommand(command: Command) {
    if (command.execute) {
      command.execute()
    }
  }

  public plantTrees(e: any) {
    console.log('planting trees')
    if (e.target instanceof Element) {
      this.executeCommand(
        new PlantTrees(this.app, e.target as HTMLImageElement)
      )
    } else {
      console.log('Unknown tree type')
    }
  }

  public clearForest() {
    this.executeCommand(new ClearForest(this.app))
  }

  public showFullForestMessage() {
    const toastLiveExample = document.getElementById('liveToast')
    let toast = new Toast(toastLiveExample)
    toast.show()
  }
}
