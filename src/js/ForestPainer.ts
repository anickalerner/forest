export class ForestPainter {
  public canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
  }
  public clearForest() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
