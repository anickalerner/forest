export class TreeType {
  name: string
  color: string
  texture: HTMLImageElement
  constructor(p_name: string, p_color: string, p_texture: HTMLImageElement) {
    this.name = p_name
    this.color = p_color
    this.texture = p_texture
  }

  public draw(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.drawImage(this.texture, 50 * x, 50 * y, 50, 50)
  }
}
