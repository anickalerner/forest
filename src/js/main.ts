import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

class TreeType{
    name: string;
    color: string;
    texture: HTMLImageElement;
    constructor(p_name: string, p_color: string, p_texture: HTMLImageElement){
        this.name = p_name;
        this.color = p_color;
        this.texture = p_texture;
    }

    public draw(context: CanvasRenderingContext2D, x: number, y: number): void{
        context.drawImage(this.texture, 50 * x, 50 * y, 50, 50);
    }
}

class TreeFactory{
    static treeTypes = new Array<TreeType>();

    public static getTreeType(name: string, color: string, texture: HTMLImageElement): TreeType{
        let ind = this.treeTypes.findIndex((tt, i) => (tt.name === name && tt.color === color && tt.texture === texture))
        if (ind < 0){
            this.treeTypes.push(new TreeType(name, color, texture));
            ind = -1;
        }
        return this.treeTypes.at(ind);
    }
}

class Tree{
    coords: Coords;
    type: TreeType;

    constructor(coords: Coords, name: string, color: string, texture: HTMLImageElement){
        this.coords = coords;
        this.type = TreeFactory.getTreeType(name, color, texture);
    }
    public draw(context: CanvasRenderingContext2D){
        this.type.draw(context, this.coords.x, this.coords.y);
    }
}

interface Coords{
    x: number;
    y: number;
}

class Forest{
    trees: Tree[][];
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    width: number;
    height: number

    constructor(w: number, h: number){
        this.width = w;
        this.height = h;
        this.initTrees();
    }

    public initTrees(){
        this.trees = [];
        for (var x = 0; x < this.height; x++) {
            this.trees[x] = [];
            for (var y = 0; y < this.width; y++) {
                this.trees[x][y] = null;
            }
        }
    }
    public reset(){
        this.initTrees();
        this.clearForest();
    }
    
    public clearForest(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public checkEmptySlots(){
        let filled: number = 0;
        for (let y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.trees[y][x]){
                    filled++;
                }
            }
        }
        return (this.width * this.height - filled);
    }

    public getRandomCoords(): Coords{
        return {
            x: Math.floor(Math.random()*this.width), 
            y: Math.floor(Math.random()*this.height)
        };
    }

    public tryPlantTree(name: string, color: string, texture: HTMLImageElement){
        let placeFound = false;
        while (!placeFound){
            let coords: Coords = this.getRandomCoords();
            if (!this.trees[coords.x][coords.y]){
                this.trees[coords.x][coords.y] = new Tree(coords, name, color, texture);
                placeFound = true;
            }
        }
    }

    public plantBunchOfTrees(texture: HTMLImageElement){
        let emptySlots = this.checkEmptySlots();
        let treesToPlant = 0;
        console.log('Empty slots: ', emptySlots);
        if (emptySlots > 0){
            let maxSlots = Math.min(emptySlots, (this.width * this.height)/2);
            treesToPlant = this.getTreeSelectionSize(maxSlots);
            console.log('Planting ', treesToPlant, ' trees');
            for (let index = 0; index < treesToPlant; index++) {
                this.tryPlantTree('oak', 'green', texture);        
            }
            this.draw();
        }
    }

    public isFull(): boolean{
        return this.checkEmptySlots()===0;
    }

    public getTreeSelectionSize(emptySlots: number){
        let size: number = 0;
        while (size===0){
            size = (emptySlots === 1) ? 1: Math.floor(Math.random() * emptySlots);
        }
        return size;
    }

    public draw(){
        this.canvas = <HTMLCanvasElement>document.getElementById("forest");
        this.context = this.canvas.getContext("2d");        
        for (let y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.trees[y][x]){
                    this.trees[y][x].draw(this.context);
                }
            }
        }
    }
}

function placeTree(e: any, forest: Forest){
    forest.plantBunchOfTrees(e.target);    
    if (forest.isFull()){
        const clearButton = document.getElementById('clear-forest');
        clearButton.classList.remove('d-none');
        clearButton.addEventListener('click', ()=>{
            forest.reset();
            clearButton.classList.add('d-none');
        });
        showFullForestMessage();
    }
}

function showFullForestMessage(){
    const toastLiveExample = document.getElementById('liveToast');
    let toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

let forest = new Forest(10, 10);

let trees = document.getElementsByClassName('treeIcon') as HTMLCollectionOf<HTMLElement>;
for (let i = 0; i < trees.length; i++){
    trees[i].addEventListener('click', (e) => placeTree(e, forest));
}