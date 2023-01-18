import { random, floor, min } from 'lodash'
import { Tree } from './Tree'
import { Coords } from './Coords'
import { ForestPainter } from './ForestPainer'
import { GUIHandler } from './GUIHandler'
import { cloneDeep } from 'lodash'

export class Forest {
  forestPainter: ForestPainter
  appGUI: GUIHandler
  width: number
  height: number
  trees: Tree[][]
  backup: Tree[][][]

  constructor(
    w: number,
    h: number,
    forestPainter: ForestPainter,
    gui: GUIHandler
  ) {
    this.forestPainter = forestPainter
    this.appGUI = gui
    this.width = w
    this.height = h
    this.initTrees()
  }

  public initTrees() {
    this.trees = []
    for (var x = 0; x < this.height; x++) {
      this.trees[x] = []
      for (var y = 0; y < this.width; y++) {
        this.trees[x][y] = null
      }
    }
  }
  public clearForest() {
    this.initTrees()
    this.forestPainter.clearForest()
  }

  public resetForest(copy: Tree[][]) {
    this.forestPainter.clearForest()
    this.trees = copy
    this.draw()
  }

  public checkEmptySlots() {
    let filled: number = 0
    for (let y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.trees[y][x]) {
          filled++
        }
      }
    }
    return this.width * this.height - filled
  }

  public getRandomCoords(): Coords {
    return {
      x: floor(random(0, this.width - 1)),
      y: floor(random(0, this.height - 1))
    }
  }

  public tryPlantTree(name: string, color: string, texture: HTMLImageElement) {
    let placeFound = false
    while (!placeFound) {
      let coords: Coords = this.getRandomCoords()
      if (!this.trees[coords.y][coords.x]) {
        this.trees[coords.y][coords.x] = new Tree(coords, name, color, texture)
        placeFound = true
      }
    }
  }

  public plantBunchOfTrees(texture: HTMLImageElement) {
    let emptySlots = this.checkEmptySlots()
    let treesToPlant = 0
    console.log('Empty slots: ', emptySlots)
    if (emptySlots > 0) {
      let maxSlots = min([emptySlots, (this.width * this.height) / 2])
      treesToPlant = this.getTreeSelectionSize(maxSlots)
      console.log('Planting ', treesToPlant, ' trees')
      for (let index = 0; index < treesToPlant; index++) {
        this.tryPlantTree('oak', 'green', texture)
      }
      this.draw()
    }
  }

  public isFull(): boolean {
    return this.checkEmptySlots() === 0
  }

  public getTreeSelectionSize(emptySlots: number) {
    let size: number = 0
    while (size === 0) {
      size = emptySlots === 1 ? 1 : floor(random(0, emptySlots))
    }
    return size
  }

  public draw() {
    for (let y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.trees[y][x]) {
          this.trees[y][x].draw(this.forestPainter.context)
        }
      }
    }
  }

  public placeTree(texture: HTMLImageElement) {
    this.saveBackup()
    this.plantBunchOfTrees(texture)
    if (this.isFull()) {
      this.appGUI.showClearButton()
    }
  }

  public saveBackup() {
    if (!this.backup) {
      this.backup = []
    }
    this.backup.push(cloneDeep(this.trees))
  }

  public undo() {
    let state = this.backup.pop()
    this.resetForest(state)
  }
}
